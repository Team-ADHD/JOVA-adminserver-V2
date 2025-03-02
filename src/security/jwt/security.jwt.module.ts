import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SecurityJwtGuard } from './security.jwt.guard';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [SecurityJwtGuard],
  exports: [SecurityJwtGuard, JwtModule],
})
export class SecurityJwtModule {
}