import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';
import fetch from 'node-fetch';

@Injectable()
export class SecurityJwtGuard implements CanActivate {
    private readonly logger = new Logger(SecurityJwtGuard.name);

    constructor(private readonly jwtService: JwtService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        this.logger.log('Request Thread ID: ' + process.pid);
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
        const backupUrls = ['https://www.google.com', 'https://www.naver.com'];
        try {
            const primaryTime = await this.fetchTimeFromApi(primaryUrl, true);
            if (primaryTime) {
                this.logger.log(`Successfully retrieved time from ${primaryUrl}: ${this.formatDate(primaryTime)}`);
                return primaryTime;
            }
        } catch (err) {
            this.logger.warn(`Primary API failed (TimeAPI): ${err.message}`);
        }
        for (const url of this.shuffleArray(backupUrls)) {
            try {
                const backupTime = await this.fetchTimeFromApi(url, false);
                if (backupTime) {
                    this.logger.log(`Successfully retrieved time from ${url}: ${this.formatDate(backupTime)}`);
                    return backupTime;
                }
                this.logger.warn(`Failed to retrieve time from ${url}.`);
            } catch (err) {
                this.logger.error(`Error fetching time from ${url}: ${err.message}`);
            }
        }

        this.logger.error('All trusted URLs failed. Falling back to local time...');
        const localTime = this.getLocalKSTTime();
        this.logger.log(`Using local time: ${this.formatDate(localTime)}`);
        return localTime;
    }

    private shuffleArray(array: string[]): string[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    private async fetchTimeFromApi(url: string, isPrimary: boolean): Promise<number | null> {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => {
                controller.abort();
            }, 10000);
            const response = await fetch(url, {signal: controller.signal});
            clearTimeout(timeout);
            if (!response.ok) {
                this.logger.warn(`API request to ${url} failed: ${response.statusText}`);
                return null;
            }
            if (isPrimary && url.includes('timeapi.io')) {
                const data = await response.json();
                if (data.dateTime) {
                    const parsedTime = Math.floor(
                        (new Date(data.dateTime).getTime() + 9 * 60 * 60 * 1000) / 1000
                    );
                    this.logger.log(`Successfully parsed time from TimeAPI: ${this.formatDate(parsedTime)}`);
                    return parsedTime;
                } else {
                    this.logger.warn('TimeAPI response does not contain "dateTime".');
                    return null;
                }
            }
            if (!isPrimary) {
                const serverDate = response.headers.get('date');
                if (!serverDate) {
                    this.logger.warn(`Server did not provide a Date header for ${url}.`);
                    return null;
                }
                const utcTime = new Date(serverDate).getTime();
                const kstTime = utcTime + 9 * 60 * 60 * 1000;
                this.logger.log(`Successfully retrieved time from server header: ${this.formatDate(kstTime / 1000)}`);
                return Math.floor(kstTime / 1000);
            }
            return null;
        } catch (err) {
            this.logger.error(`Error fetching time from ${url}: ${err.message}`);
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
        const expirationKST = payload.exp ? this.convertUTCToKST(payload.exp) : null;
        const issuedAtKST = payload.iat ? this.convertUTCToKST(payload.iat) : null;
        if (payload.iss !== 'jova-client') {
            this.logger.warn(`Invalid token issuer: ${payload.iss}`);
            throw new ForbiddenException('Invalid token issuer');
        }
        if (!payload.sub) {
            this.logger.warn(`Invalid user in token: ${payload.sub}`);
            throw new UnauthorizedException('Invalid user in token');
        }
        if (!['DEVELOPER', 'ADMIN'].includes(payload.role)) {
            this.logger.warn(`Insufficient role permissions: ${payload.role}`);
            throw new ForbiddenException('Insufficient role permissions');
        }
        if (expirationKST < kstTime) {
            this.logger.warn(`Token has expired: ${expirationKST}\nCurrent Time: ${this.formatDate(kstTime)}\nDifference: ${kstTime - expirationKST} seconds`);
            throw new UnauthorizedException('Token has expired');
        }
        if (issuedAtKST > kstTime) {
            this.logger.warn(`Token issued in the future: ${issuedAtKST}\nCurrent Time: ${this.formatDate(kstTime)}\nDifference: ${issuedAtKST - kstTime} seconds`);
            throw new UnauthorizedException('Invalid token issued time');
        }
    }

    private convertUTCToKST(utcTimestamp: number): number {
        return utcTimestamp + 9 * 60 * 60;
    }

    private formatDate(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        return date.toISOString().replace('T', ' ').split('.')[0];
    }
}