import { UserRoleEnum } from '../../../users/enums/user.role.enum';
import { BaseUserResponseDto } from './base-user-response.dto';

export class UpdateUserResponseDto extends BaseUserResponseDto {
  banned: boolean;

  constructor(id: number, email: string, role: UserRoleEnum, grade: number, classNum: number, generation: number, profilePictureUri: string | null, banned: boolean) {
    super(id, email, role, grade, classNum, generation, profilePictureUri);
    this.banned = banned;
  }
}