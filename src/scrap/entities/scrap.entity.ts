import {JobEntity} from "../../jobs/entities/job.entity";
import {Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../users/entities/user.entity";

@Entity('scraps')
export class ScrapEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @OneToOne(() => UserEntity, {cascade: true, eager: false, orphanedRowAction: 'delete'})
    @JoinColumn({name: 'user_id'})
    user: UserEntity;
    @OneToMany(() => JobEntity, (job) => job.id, {eager: false})
    scrapJobs: JobEntity[];
}