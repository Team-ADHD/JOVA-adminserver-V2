import {Injectable, NotFoundException} from '@nestjs/common';
import {DataSource, Repository} from 'typeorm';
import {UserEntity} from '../entities/user.entity';
import {AlreadyUserException} from "../../admin/exception/already-user.exception";

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(UserEntity, dataSource.createEntityManager());
    }

    public async findOneById(id: number): Promise<UserEntity | null> {
        return this.findOne({where: {id}});
    }

    public async findOneByEmail(email: string): Promise<UserEntity | null> {
        return this.findOne({where: {email}});
    }

    private async findOneByGradeClassAndGeneration(
        grade: number,
        classNum: number,
        generation: number,
    ): Promise<UserEntity | null> {
        return this.findOne({where: {grade, classNum, generation}});
    }

    public async findAll(): Promise<UserEntity[]> {
        return this.find();
    }

    public async findAllPaginated(page: number, limit: number): Promise<UserEntity[]> {
        return this.find({
            skip: (page - 1) * limit,
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
            throw new AlreadyUserException("User with the same grade, class, and generation already exists");
        }
        return this.save(user);
    }

    public async updateById(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
        const user = await this.findOneById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        Object.assign(user, data);
        return this.save(user);
    }

    public async updateBannedStatusById(id: number, banned: boolean): Promise<UserEntity> {
        const user = await this.findOneById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        user.banned = banned;
        return this.save(user);
    }
}