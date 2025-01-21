import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MajorEntity } from '../../majors/entities/major.entity';
import { Application } from '../../applications/entities/application.entity';
import { JobStatusEnum } from '../enums/job.status.enum';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('jobs')
export class JobEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => UserEntity, { nullable: false, eager: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @Column({ length: 100, nullable: false })
  title: string;
  @Column({ name: 'content', type: 'text', nullable: false })
  description: string;
  @Column({ name: 'deadline', type: 'timestamp', nullable: false })
  closingDate: Date;
  @Column({ type: 'enum', enum: JobStatusEnum, nullable: false })
  status: JobStatusEnum;
  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];
  @ManyToMany(() => MajorEntity)
  @JoinTable({
    name: 'job_required_majors',
    joinColumn: { name: 'job_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'major_id', referencedColumnName: 'id' },
  })
  requiredMajors: MajorEntity[];
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}