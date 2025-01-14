import {Entity, Column, PrimaryGeneratedColumn, ManyToMany} from "typeorm";
import {JobEntity} from "./job.entity";

@Entity("majors")
export class MajorEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({length: 20, unique: true})
    name: string;
    @ManyToMany(() => JobEntity, (job) => job.requiredMajors)
    jobs: JobEntity[];
}