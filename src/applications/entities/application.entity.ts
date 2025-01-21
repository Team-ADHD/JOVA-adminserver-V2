import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApplicationStatusEnum } from '../enums/application.status.enum';
import { JobEntity } from '../../jobs/entities/job.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { MajorEntity } from '../../majors/entities/major.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => JobEntity, { nullable: false, eager: false })
  @JoinColumn({ name: 'job_id' })
  job: JobEntity;
  @ManyToOne(() => UserEntity, { nullable: false, eager: false })
  @JoinColumn({ name: 'user_id' })
  applicant: UserEntity;
  @ManyToOne(() => MajorEntity, { nullable: false, eager: false })
  @JoinColumn({ name: 'major_id' })
  major: MajorEntity;
  @Column({ type: 'text', nullable: true })
  content: string;
  @Column({ type: 'enum', enum: ApplicationStatusEnum, nullable: false })
  status: ApplicationStatusEnum;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}