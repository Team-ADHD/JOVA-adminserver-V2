import {IsEmail, IsEnum, IsInt, IsString, Max, Min, MinLength, MaxLength, ValidateIf} from 'class-validator';
import {UserRoleEnum} from "../../../users/enums/user.role.enum";
import {UserEntity} from "../../../users/entities/user.entity";

export class UpdateUserRequestDto {
    @ValidateIf((o) => o.email !== undefined)
    @IsString({message: 'Email must be a string'})
    @IsEmail({}, {message: 'Invalid email address'})
    email?: string;
    @ValidateIf((o) => o.password !== undefined)
    @IsString({message: 'Password must be a string'})
    @MinLength(6, {message: 'Password must be at least 6 characters long'})
    @MaxLength(100, {message: 'Password must be at most 100 characters long'})
    password?: string;
    @ValidateIf((o) => o.role !== undefined)
    @IsEnum(UserRoleEnum, {message: 'Invalid role provided'})
    role?: UserRoleEnum;
    @ValidateIf((o) => o.grade !== undefined)
    @IsInt({message: 'Grade must be an integer'})
    @Max(4, {message: 'Grade must be at most 4'})
    @Min(1, {message: 'Grade must be at least 1'})
    grade?: number;
    @ValidateIf((o) => o.classNum !== undefined)
    @IsInt({message: 'Class number must be an integer'})
    @Max(4, {message: 'Class number must be at most 4'})
    @Min(1, {message: 'Class number must be at least 1'})
    classNum?: number;
    @ValidateIf((o) => o.generation !== undefined)
    @IsInt({message: 'Generation must be an integer'})
    @Max(9, {message: 'Generation must be at most 9'})
    @Min(1, {message: 'Generation must be at least 1'})
    generation?: number;
    @ValidateIf((o) => o.profilePictureUri !== undefined)
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