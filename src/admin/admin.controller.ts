import {Body, Controller, Patch, Post} from '@nestjs/common';
import {AdminService} from "./admin.service";
import {CreateUserRequestDto} from "./dto/request/create-user-request.dto";
import {plainToInstance} from "class-transformer";

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post('users')
    async createUser(@Body() request:CreateUserRequestDto) {
        return this.adminService.createUser(plainToInstance(CreateUserRequestDto,request));
    }

    @Patch('users/:id')
    async updateUserInfo() {
        return null;
    }
}
