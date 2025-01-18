import {Injectable} from '@nestjs/common';
import {UserRepository} from "../users/repository/user.repository";
import {UserEntity} from "../users/entities/user.entity";
import {UpdateUserRequestDto} from "./dto/request/update-user-request.dto";
import {CreateUserRequestDto} from "./dto/request/create-user-request.dto";
import {CreateUserResponseDto} from "./dto/response/create-user-response.dto";
import {FindUsersResponseDto} from "./dto/response/find-user-response.dto";
import {UpdateUserResponseDto} from "./dto/response/update-user-response.dto";
import {SecurityBcryptService} from "../security/security.bcrypt.service";
import {ScrapRepository} from "../scrap/repository/scrap.repository";

@Injectable()
export class AdminService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly scrapRepository: ScrapRepository,
        private readonly securityBcryptService: SecurityBcryptService
    ) {
    }

    async findAllUsers(): Promise<FindUsersResponseDto[]> {
        return this.userRepository.findAll().then((value) => {
            return value.map((user) => FindUsersResponseDto.apply(user));
        });
    }

    async findPaginatedUsers(page: number, limit: number): Promise<FindUsersResponseDto[]> {
        return this.userRepository.findAllPaginated(page, limit).then((value) => {
            return value.map((user) => FindUsersResponseDto.apply(user));
        });
    }

    async createUser(createUserDTO: CreateUserRequestDto): Promise<CreateUserResponseDto> {
        createUserDTO.password = await this.securityBcryptService.hashPassword(createUserDTO.password);
        const user = this.userRepository.create({
            ...createUserDTO.toEntity(),
            profilePictureUri: null,
            banned: false,
        });
        const createResult: UserEntity = await this.userRepository.createAndSave(user);
        if (!await this.scrapRepository.createAndSave(await this.userRepository.findOneById(createResult.id))) {
            throw new Error("Failed to create scrap");
        }
        return new CreateUserResponseDto(createResult.id, createResult.email, createResult.role, createResult.grade, createResult.classNum, createResult.generation, createResult.profilePictureUri);
    }

    async updateUserInfo(id: number, data: Partial<UpdateUserRequestDto>): Promise<UpdateUserResponseDto> {
        if (data.password) {
            data.password = await this.securityBcryptService.hashPassword(data.password);
        }
        const user = await this.userRepository.updateById(id, data);
        return new UpdateUserResponseDto(user.id, user.email, user.role, user.grade, user.classNum, user.generation, user.profilePictureUri);
    }

    async updateBannedStatus(id: number, banned: boolean): Promise<UserEntity> {
        return this.userRepository.updateBannedStatusById(id, banned);
    }
}
