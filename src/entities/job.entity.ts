import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import {UserEntity} from "./user.entity";
import {MajorEntity} from "./major.entity";
import {ApplicationEntity} from "./application.entity";

@Entity("jobs")
export class JobEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({length: 100})
    title: string;
    @Column({type: "text"})
    description: string;
    @Column({type: "timestamp"})
    deadline: Date;
    @Column({type: "enum", enum: ["OPEN", "CLOSED"], default: "OPEN"})
    status: "OPEN" | "CLOSED";
    @ManyToOne(() => UserEntity, (user) => user.jobs, {onDelete: "CASCADE"})
    user: UserEntity;
    @ManyToMany(() => MajorEntity, (major) => major.jobs)
    @JoinTable({
        name: "job_required_majors",
        joinColumn: {name: "job_id", referencedColumnName: "id"},
        inverseJoinColumn: {name: "major_id", referencedColumnName: "id"},
    })
    requiredMajors: MajorEntity[];
    @OneToMany(() => ApplicationEntity, (application) => application.job)
    applications: ApplicationEntity[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}