import { Expose } from 'class-transformer';
import { UserRoleEnum } from '../../../users/enums/user.role.enum';

export class BaseUserResponseDto {
  constructor(id: number, email: string, role: UserRoleEnum, grade: number, classNum: number, generation: number, profilePictureUri: string) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.grade = grade;
    this.classNum = classNum;
    this.generation = generation;
    this.profilePictureUri = profilePictureUri;
  }

  readonly id: number;
  @Expose()
  readonly email: string;
  @Expose()
  readonly role: UserRoleEnum;
  @Expose()
  readonly grade: number;
  @Expose()
  readonly classNum: number;
  @Expose()
  readonly generation: number;
  @Expose()
  readonly profilePictureUri: string;
}