import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserRepository } from '../users/repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { SecurityBcryptService } from '../security/security.bcrypt.service';
import { ScrapRepository } from '../scrap/repository/scrap.repository';
import { SecurityJwtModule } from '../security/jwt/security.jwt.module';
import { AlarmRepository } from '../alarm/repository/alarm.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    SecurityJwtModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, UserRepository, ScrapRepository, AlarmRepository, SecurityBcryptService],
  exports: [SecurityBcryptService],
})
export class AdminModule {
}