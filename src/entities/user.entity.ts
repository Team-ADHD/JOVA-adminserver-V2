import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import {JobEntity} from "./job.entity";
import {ApplicationEntity} from "./application.entity";

@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({length: 36, unique: true})
    uuid: string;
    @Column({length: 50, unique: true})
    email: string;
    @Column({length: 100})
    password: string;
    @Column({type: "enum", enum: ["ADMIN", "DEVELOPER", "USER"], default: "USER"})
    role: "ADMIN" | "DEVELOPER" | "USER";
    @Column({type: "int"})
    grade: number;
    @Column({type: "int"})
    classNum: number;
    @Column({type: "int"})
    generation: number;
    @Column({length: 100, nullable: true})
    profilePictureUri: string | null;
    @Column({default: false})
    banned: boolean;
    @OneToMany(() => JobEntity, (job) => job.user)
    jobs: JobEntity[];
    @OneToMany(() => ApplicationEntity, (application) => application.user)
    applications: ApplicationEntity[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}