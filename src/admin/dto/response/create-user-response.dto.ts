import {UserRoleEnum} from "../../../users/enums/user.role.enum";

export class CreateUserResponseDto {
    id: number;
    email: string;
    role: UserRoleEnum;
    grade: number;
    classNum: number;
    generation: number;
    profilePictureUri: string | null;

    constructor(id: number, email: string, role: UserRoleEnum, grade: number, classNum: number, generation: number, profilePictureUri: string | null) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.grade = grade;
        this.classNum = classNum;
        this.generation = generation;
        this.profilePictureUri = profilePictureUri;
    }
}