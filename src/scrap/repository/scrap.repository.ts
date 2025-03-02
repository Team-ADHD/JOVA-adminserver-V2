import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ScrapEntity } from '../entities/scrap.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class ScrapRepository extends Repository<ScrapEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ScrapEntity, dataSource.createEntityManager());
  }

  public async findByUser(user: UserEntity): Promise<ScrapEntity | null> {
    return this.findOne({ where: { user } });
  }

  public async createAndSave(user: UserEntity): Promise<boolean> {
    try {
      const scrap: ScrapEntity = this.create({ user });
      await this.save(scrap);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}