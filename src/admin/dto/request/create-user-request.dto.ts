import {UserRoleEnum} from "../../../users/enums/user.role.enum";
import {IsEmail, IsEnum, IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength} from "class-validator";
import {UserEntity} from "../../../users/entities/user.entity";
import {v4 as uuidv4} from "uuid";

export class CreateUserRequestDto {
    @IsEmail({}, {message: 'Invalid email address'})
    @MaxLength(50, {message: 'Email must be at most 50 characters long'})
    @IsNotEmpty({message: 'Email must be provided'})
    email: string;
    @IsString({message: 'Password must be a string'})
    @MinLength(6, {message: 'Password must be at least 6 characters long'})
    @MaxLength(100, {message: 'Password must be at most 100 characters long'})
    @IsNotEmpty({message: 'Password must be provided'})
    password: string;
    @IsEnum(UserRoleEnum, {message: 'Invalid role provided'})
    @IsNotEmpty({message: 'Role must be provided'})
    role: UserRoleEnum;
    @IsInt({message: 'Grade must be an integer'})
    @IsNotEmpty({message: 'Grade must be provided'})
    @Max(4, {message: 'Grade must be at most 4'})
    @Min(1, {message: 'Grade must be at least 1'})
    grade: number;
    @IsInt({message: 'Class number must be an integer'})
    @IsNotEmpty({message: 'Class number must be provided'})
    @Max(4, {message: 'Class number must be at most 4'})
    @Min(1, {message: 'Class number must be at least 1'})
    classNum: number;
    @IsInt({message: 'Generation must be an integer'})
    @IsNotEmpty({message: 'Generation must be provided'})
    @Max(9, {message: 'Generation must be at most 9'})
    @Min(1, {message: 'Generation must be at least 1'})
    generation: number;

    toEntity(): UserEntity {
        const user = new UserEntity();
        user.UUID = uuidv4();
        user.email = this.email;
        user.password = this.password;
        user.role = this.role;
        user.grade = this.grade;
        user.classNum = this.classNum;
        user.generation = this.generation;
        return user;
    }
}