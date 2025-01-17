import {UserRoleEnum} from "../../../users/enums/user.role.enum";

export class FindUsersResponseDto {
    id: number;
    email: string;
    role: UserRoleEnum;
    grade: number;
    classNum: number;
    generation: number;
    profilePictureUri: string | null;

    Constructor(id: number, email: string, role: UserRoleEnum, grade: number, classNum: number, generation: number, profilePictureUri: string | null) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.grade = grade;
        this.classNum = classNum;
        this.generation = generation;
        this.profilePictureUri = profilePictureUri;
    }
}