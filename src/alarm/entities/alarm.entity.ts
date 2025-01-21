import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { AlarmStatusEnum } from '../enums/alarm.status.enum';
import { AlarmContent } from '../dto/alarm.content';

@Entity('alarms')
export class Alarm {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @Column({ name: 'alarm_status', type: 'enum', enum: AlarmStatusEnum, nullable: false })
  alarmStatus: AlarmStatusEnum;
  @Column(() => AlarmContent)
  alarmContent: AlarmContent;
}