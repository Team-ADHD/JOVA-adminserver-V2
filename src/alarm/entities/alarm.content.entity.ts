import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AlarmStatusEnum } from '../enums/alarm.status.enum';
import { AlarmLevelEnum } from '../enums/alarm.level.enum';
import { AlarmEntity } from './alarm.entity';

@Entity('alarm_contents')
export class AlarmContentEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  title: string;
  @Column({ nullable: false })
  content: string;
  @Column({ type: 'enum', enum: AlarmStatusEnum, nullable: false })
  status: AlarmStatusEnum;
  @Column({ type: 'enum', enum: AlarmLevelEnum, nullable: false })
  level: AlarmLevelEnum;
  @Column({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt: Date;
  @ManyToOne(() => AlarmEntity, (alarm) => alarm.alarmContents, { onDelete: 'CASCADE' })
  alarm: AlarmEntity;
}