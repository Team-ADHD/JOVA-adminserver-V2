import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../users/repository/user.repository';
import { UserEntity } from '../users/entities/user.entity';
import { UpdateUserRequestDto } from './dto/request/update-user-request.dto';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { CreateUserResponseDto } from './dto/response/create-user-response.dto';
import { FindUserResponseDto } from './dto/response/find-user-response.dto';
import { UpdateUserResponseDto } from './dto/response/update-user-response.dto';
import { SecurityBcryptService } from '../security/security.bcrypt.service';
import { ScrapRepository } from '../scrap/repository/scrap.repository';
import { FindUserRequestDto } from './dto/request/find-user-request.dto';
import { AlarmRepository } from '../alarm/repository/alarm.repository';

@Injectable()
export class AdminService {

  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly scrapRepository: ScrapRepository,
    private readonly alarmRepository: AlarmRepository,
    private readonly securityBcryptService: SecurityBcryptService,
  ) {
  }

  async findAllUsers(): Promise<FindUserResponseDto[]> {
    return this.userRepository.findAll().then((value) => {
      this.logger.warn(`Found All Users: ${value.length}`);
      return value.map((user) => new FindUserResponseDto(user.id, user.email, user.role, user.grade, user.classNum, user.generation, user.profilePictureUri, user.banned));
    });
  }

  async findSearchUsers(query: FindUserRequestDto): Promise<FindUserResponseDto[]> {
    const {
      page,
      offset,
      limit,
      sortField,
      sortOrder,
      generation,
      grade,
      classNum,
      banned,
      role,
    } = query;
    const calculatedOffset = offset ?? (page - 1) * limit;
    const validSortFields = ['id', 'email', 'grade', 'classNum', 'generation', 'banned'];
    if (!validSortFields.includes(sortField)) {
      throw new Error(`Invalid sort field: ${sortField}`);
    }
    const users = await this.userRepository.findSearchAndPaginate(
      calculatedOffset,
      limit,
      sortField,
      sortOrder,
      generation,
      grade,
      classNum,
      banned,
      role,
    );
    this.logger.log(`Search Users: ${users.length}`);
    return users.map((user) =>
      new FindUserResponseDto(
        user.id,
        user.email,
        user.role,
        user.grade,
        user.classNum,
        user.generation,
        user.profilePictureUri,
        user.banned,
      ),
    );
  }

  async createUser(createUserDTO: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    createUserDTO.password = await this.securityBcryptService.hashPassword(createUserDTO.password);
    const user = this.userRepository.create({
      ...createUserDTO.toEntity(),
      profilePictureUri: null,
      banned: false,
    });
    const createResult: UserEntity = await this.userRepository.createAndSave(user);
    if (!await this.scrapRepository.createAndSave(createResult)) {
      throw new Error('Failed to create scrap');
    }
    if (!await this.alarmRepository.createAndSave(createResult)) {
      throw new Error('Failed to create alarm');
    }
    this.logger.log(`Created user: Email: ${createResult.email} | UUID: ${createResult.UUID} | Role: ${createResult.role}`);
    return new CreateUserResponseDto(createResult.id, createResult.email, createResult.role, createResult.grade, createResult.classNum, createResult.generation, createResult.profilePictureUri);
  }

  async updateUserInfo(id: number, data: Partial<UpdateUserRequestDto>): Promise<UpdateUserResponseDto> {
    if (data.password) {
      data.password = await this.securityBcryptService.hashPassword(data.password);
    }
    const user = await this.userRepository.updateById(id, data);
    this.logger.log(`Updated user: Email: ${user.email} | UUID: ${user.UUID} | Role: ${user.role} \n Updated Spot: ${JSON.stringify(data)}`);
    return new UpdateUserResponseDto(user.id, user.email, user.role, user.grade, user.classNum, user.generation, user.profilePictureUri, user.banned);
  }

  async updateBannedStatus(id: number, banned: boolean): Promise<UpdateUserResponseDto> {
    const user = await this.userRepository.updateBannedStatusById(id, banned);
    this.logger.log(`Updated user: Email: ${user.email} | UUID: ${user.UUID} | Role: ${user.role} \n New Banned Status: ${banned}`);
    return new UpdateUserResponseDto(user.id, user.email, user.role, user.grade, user.classNum, user.generation, user.profilePictureUri, user.banned);
  }
}