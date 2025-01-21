import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { AlarmContentEntity } from './alarm.content.entity';

@Entity('alarms')
export class AlarmEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => UserEntity, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @OneToMany(() => AlarmContentEntity, (content) => content.alarm, { cascade: true })
  alarmContents: AlarmContentEntity[];
}