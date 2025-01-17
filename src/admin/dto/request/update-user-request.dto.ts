import {UserRoleEnum} from "../../../users/enums/user.role.enum";

export class UpdateUserRequestDto {
    email?: string;
    password?: string;
    role?: UserRoleEnum;
    grade?: number;
    classNum?: number;
    generation?: number;
    profilePictureUri?: string | null;
}