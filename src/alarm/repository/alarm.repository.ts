import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AlarmEntity } from '../entities/alarm.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class AlarmRepository extends Repository<AlarmEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AlarmEntity, dataSource.createEntityManager());
  }

  public async createAndSave(user: UserEntity): Promise<boolean> {
    try {
      const alarm: AlarmEntity = this.create({ user });
      await this.save(alarm);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}