import {Body, Controller, Get, Param, Patch, Post} from '@nestjs/common';
import {AdminService} from "./admin.service";
import {CreateUserRequestDto} from "./dto/request/create-user-request.dto";
import {plainToInstance} from "class-transformer";
import {UpdateUserRequestDto} from "./dto/request/update-user-request.dto";
import {CreateUserResponseDto} from "./dto/response/create-user-response.dto";
import {UpdateUserResponseDto} from "./dto/response/update-user-response.dto";
import {FindUsersResponseDto} from "./dto/response/find-user-response.dto";
import {UpdateUserStatusRequestDto} from "./dto/request/update-user-status-request.dto";

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {
    }

    @Get('users')
    async findAllUsers(): Promise<FindUsersResponseDto[]> {
        return this.adminService.findAllUsers();
    }

    @Post('users')
    async createUser(@Body() request: CreateUserRequestDto): Promise<CreateUserResponseDto> {
        return this.adminService.createUser(plainToInstance(CreateUserRequestDto, request));
    }

    @Patch('users/:id')
    async updateUserInfo(
        @Param('id') id: number,
        @Body() request: UpdateUserRequestDto
    ): Promise<UpdateUserResponseDto> {
        return this.adminService.updateUserInfo(id, plainToInstance(UpdateUserRequestDto, request));
    }

    @Patch('users/:id/banned')
    async updateBannedStatus(
        @Param('id') id: number,
        @Body() request: UpdateUserStatusRequestDto
    ): Promise<UpdateUserResponseDto> {
        return await this.adminService.updateBannedStatus(id, request.banned);
    }
}
