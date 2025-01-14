import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import {JobEntity} from "./job.entity";
import {UserEntity} from "./user.entity";
import {MajorEntity} from "./major.entity";

@Entity("applications")
export class ApplicationEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type: "text"})
    content: string;
    @Column({type: "enum", enum: ["ACCEPTED", "PENDING", "REJECTED"], default: "PENDING"})
    status: "ACCEPTED" | "PENDING" | "REJECTED";
    @ManyToOne(() => JobEntity, (job) => job.applications, {onDelete: "CASCADE"})
    job: JobEntity;
    @ManyToOne(() => UserEntity, (user) => user.applications, {onDelete: "CASCADE"})
    user: UserEntity;
    @ManyToOne(() => MajorEntity, {onDelete: "CASCADE"})
    major: MajorEntity;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}