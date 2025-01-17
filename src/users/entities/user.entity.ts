import {BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {UserRoleEnum} from "../enums/user.role.enum";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({length: 36, unique: true, nullable: false, type: 'uuid', name: 'uuid'})
    UUID: string;
    @Column({length: 50, unique: true, nullable: false})
    email: string;
    @Column({length: 100, nullable: false})
    password: string;
    @Column({type: 'enum', enum: UserRoleEnum, nullable: false})
    role: UserRoleEnum;
    @Column({type: 'int', nullable: false})
    grade: number;
    @Column({name: "class_num", type: 'int', nullable: false})
    classNum: number;
    @Column({type: 'int', nullable: false})
    generation: number;
    @Column({name: "profile_picture_uri", length: 100, nullable: true, default: null})
    profilePictureUri: string;
    @Column({type: 'boolean', default: false})
    banned: boolean;
}