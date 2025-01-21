import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { APP_FILTER } from '@nestjs/core';
import { BaseExceptionFilter } from './exceptions/base-exception.filter';
import { SecurityBcryptService } from './security/security.bcrypt.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'test'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: BaseExceptionFilter,
    },
    SecurityBcryptService,
    AppService,
  ],
  exports: [SecurityBcryptService],
})
export class AppModule {
}