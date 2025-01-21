import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import fetch from 'node-fetch';

@Injectable()
export class SecurityJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('JWT token is missing');
    }
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const kstTime = await this.getCurrentKSTTime();
      if (!kstTime) {
        throw new InternalServerErrorException('Failed to retrieve KST time');
      }
      this.validatePayload(payload, kstTime);
      request.user = payload;
    } catch (err) {
      if (err instanceof UnauthorizedException || err instanceof ForbiddenException) {
        throw err;
      }
      throw new InternalServerErrorException(err.message || 'Unexpected error occurred');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    return null;
  }

  private async getCurrentKSTTime(): Promise<number> {
    const primaryUrl = 'https://timeapi.io/api/Time/current/zone?timeZone=Asia/Seoul';
    const backupUrl = 'https://worldtimeapi.org/api/timezone/Asia/Seoul';
    try {
      const primaryTime = await this.fetchTimeFromApi(primaryUrl);
      if (primaryTime) {
        return primaryTime;
      }
      console.error('Primary API failed. Attempting backup API...');
      const backupTime = await this.fetchTimeFromApi(backupUrl);
      if (backupTime) {
        return backupTime;
      }
      console.error('Both primary and backup APIs failed. Falling back to local time...');
      return this.getLocalKSTTime();
    } catch (err) {
      console.error('Failed to retrieve KST time from all sources:', err.message);
      return this.getLocalKSTTime();
    }
  }

  private async fetchTimeFromApi(url: string): Promise<number | null> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        controller.abort();
      }, 10000);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) {
        console.error(`API request failed: ${response.statusText}`);
        return null;
      }
      const data = await response.json();
      if (url.includes('timeapi.io')) {
        return Math.floor(new Date(data.dateTime).getTime() / 1000);
      }
      if (url.includes('worldtimeapi.org')) {
        return Math.floor(new Date(data.datetime).getTime() / 1000);
      }
      return null;
    } catch (err) {
      console.error(`Error fetching time from ${url}:`, err.message);
      return null;
    }
  }

  private getLocalKSTTime(): number {
    const now = new Date();
    const utcOffset = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstTime = utcOffset + kstOffset;
    return Math.floor(kstTime / 1000);
  }

  private validatePayload(payload: any, kstTime: number): void {
    if (payload.iss !== 'jova-client') {
      throw new ForbiddenException('Invalid token issuer');
    }
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid user in token');
    }
    if (!['DEVELOPER', 'ADMIN'].includes(payload.role)) {
      throw new ForbiddenException('Insufficient role permissions');
    }
    if (payload.exp < kstTime) {
      throw new UnauthorizedException('Token has expired');
    }
    if (payload.iat > kstTime) {
      throw new UnauthorizedException('Invalid token issued time');
    }
  }
}