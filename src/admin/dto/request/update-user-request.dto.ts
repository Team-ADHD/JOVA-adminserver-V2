import {UserRoleEnum} from "../../../users/enums/user.role.enum";
import {IsEmail, IsEnum, IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength} from "class-validator";
import {UserEntity} from "../../../users/entities/user.entity";

export class UpdateUserRequestDto {
    @IsString({message: 'Email must be a string'})
    @IsEmail({}, {message: 'Invalid email address'})
    email?: string;
    @IsString({message: 'Password must be a string'})
    @MinLength(6, {message: 'Password must be at least 6 characters long'})
    @MaxLength(100, {message: 'Password must be at most 100 characters long'})
    password?: string;
    @IsEnum(UserRoleEnum, {message: 'Invalid role provided'})
    role?: UserRoleEnum;
    @IsInt({message: 'Grade must be an integer'})
    @Max(4, {message: 'Grade must be at most 4'})
    @Min(1, {message: 'Grade must be at least 1'})
    grade?: number;
    @IsInt({message: 'Class number must be an integer'})
    @Max(4, {message: 'Class number must be at most 4'})
    @Min(1, {message: 'Class number must be at least 1'})
    classNum?: number;
    @IsInt({message: 'Generation must be an integer'})
    @Max(9, {message: 'Generation must be at most 9'})
    @Min(1, {message: 'Generation must be at least 1'})
    generation?: number;
    @IsString({message: 'Profile picture URI must be a string'})
    profilePictureUri?: string | null;

    toEntity(): UserEntity {
        const user = new UserEntity();
        if (this.email) user.email = this.email;
        if (this.password) user.password = this.password;
        if (this.role) user.role = this.role;
        if (this.grade) user.grade = this.grade;
        if (this.classNum) user.classNum = this.classNum;
        if (this.generation) user.generation = this.generation;
        if (this.profilePictureUri) user.profilePictureUri = this.profilePictureUri;
        return user;
    }
}