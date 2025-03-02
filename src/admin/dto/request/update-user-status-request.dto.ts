import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateUserStatusRequestDto {
  @IsNotEmpty({ message: 'Banned status must be provided' })
  @IsBoolean({ message: 'Banned status must be a boolean' })
  banned: boolean;
}