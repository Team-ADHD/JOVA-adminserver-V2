import {IsOptional, IsIn, IsInt, Min, IsEnum, ValidateIf, IsBoolean, Max} from 'class-validator';
import {Transform} from 'class-transformer';
import {UserRoleEnum} from "../../../users/enums/user.role.enum";

export class FindUserRequestDto {
    @ValidateIf((obj) => obj.offset === undefined)
    @IsInt()
    @Min(1)
    @Transform(({value}) => parseInt(value, 10))
    page?: number;
    @ValidateIf((obj) => obj.page === undefined)
    @IsInt()
    @Min(0)
    @Transform(({value}) => parseInt(value, 10))
    offset?: number;
    @IsInt()
    @Min(1)
    @Transform(({value}) => parseInt(value, 10))
    limit: number;
    @IsOptional()
    @IsIn(['id', 'email', 'grade', 'classNum', 'generation', 'banned'])
    sortField: string = 'id';
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder: 'asc' | 'desc' = 'asc';
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(9)
    @Transform(({value}) => (value !== undefined ? parseInt(value, 10) : undefined))
    generation?: number;
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(3)
    @Transform(({value}) => (value !== undefined ? parseInt(value, 10) : undefined))
    grade?: number;
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(4)
    @Transform(({value}) => (value !== undefined ? parseInt(value, 10) : undefined))
    classNum?: number;
    @IsOptional()
    @IsBoolean()
    @Transform(({value}) => {
        if (typeof value === 'string') {
            return value.toLowerCase() === 'true';
        }
        return !!value;
    })
    banned?: boolean;
    @IsOptional()
    @IsEnum(UserRoleEnum)
    role?: UserRoleEnum;
}