import { Column } from 'typeorm';
import { AlarmLevelEnum } from '../enums/alarm.level.enum';

export class AlarmContent {
  @Column({ nullable: false })
  title: string;
  @Column({ nullable: false })
  content: string;
  @Column({ type: 'enum', enum: AlarmLevelEnum, nullable: false })
  level: AlarmLevelEnum;
  @Column({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt: Date;
}