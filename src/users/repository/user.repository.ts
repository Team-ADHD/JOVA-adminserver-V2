import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { AlreadyUserException } from '../../admin/exception/already-user.exception';
import { UserRoleEnum } from '../enums/user.role.enum';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  public async findOneById(id: number): Promise<UserEntity | null> {
    return this.findOne({ where: { id } });
  }

  public async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({ where: { email } });
  }

  public async findAll(): Promise<UserEntity[]> {
    return this.find();
  }

  public async findSearchAndPaginate(
    offset: number,
    limit: number,
    sortField: string,
    sortOrder: 'asc' | 'desc',
    generation?: number,
    grade?: number,
    classNum?: number,
    banned?: boolean,
    role?: UserRoleEnum,
  ): Promise<UserEntity[]> {
    const where: any = {};
    if (generation !== undefined) where.generation = generation;
    if (grade !== undefined) where.grade = grade;
    if (classNum !== undefined) where.classNum = classNum;
    if (banned !== undefined) where.banned = banned;
    if (role !== undefined) where.role = role;
    console.log('Generated WHERE clause:', where);
    return this.find({
      where,
      order: {
        [sortField]: sortOrder,
      },
      skip: offset,
      take: limit,
    });
  }

  public async createAndSave(user: UserEntity): Promise<UserEntity> {
    const existingUserByDetails = await this.findOneByGradeClassAndGeneration(
      user.grade,
      user.classNum,
      user.generation,
    );
    if (existingUserByDetails) {
      throw new AlreadyUserException('User with the same grade, class, and generation already exists');
    }
    return this.save(user);
  }

  public async updateById(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.findOneById(id);
    console.log(user.banned);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const beforeUserStatus = user.banned;
    if (data.email) {
      user.email = data.email;
    }
    if (data.password) {
      user.password = data.password;
    }
    if (data.role) {
      user.role = data.role;
    }
    if (data.grade) {
      user.grade = data.grade;
    }
    if (data.classNum) {
      user.classNum = data.classNum;
    }
    if (data.generation) {
      user.generation = data.generation;
    }
    if (data.profilePictureUri) {
      user.profilePictureUri = data.profilePictureUri;
    }
    if (beforeUserStatus !== user.banned) {
      user.banned = beforeUserStatus;
    }
    if (await this.findOneByGradeClassAndGeneration(user.grade, user.classNum, user.generation)) {
      throw new AlreadyUserException('User with the same grade, class, and generation already exists');
    }
    return await this.save(user);
  }

  public async updateBannedStatusById(id: number, banned: boolean): Promise<UserEntity> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.banned = banned;
    return await this.save(user);
  }

  private async findOneByGradeClassAndGeneration(
    grade: number,
    classNum: number,
    generation: number,
  ): Promise<UserEntity | null> {
    return this.findOne({ where: { grade, classNum, generation } });
  }
}