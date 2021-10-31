import { Roles } from './../auth/decorators/roles.decorator';
import { Request } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { Controller, Get, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Post()
    async register(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
        return await this.userService.create(req, createUserDto);
    }

    @Post('login')
    async login(@Req() req: Request, @Body() loginUserDto: LoginUserDto) {
        return await this.userService.login(req, loginUserDto);
    }

    @Get('auth-by-token')
    @UseGuards(AuthGuard('jwt'))
    async findAll(@Req() req: Request) {
        return await this.userService.loginByAuth(req);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin', 'helper', 'legal')
    async appById(@Param() params) {
        return await this.userService.getUserById(params.id);
    }

    @Post(':id')
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    async updateUser(@Body() updateUserDto: UpdateUserDto) {
        return await this.userService.updateUser(updateUserDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin', 'helper')
    async getAllUsers(@Req() req: Request) {
        return await this.userService.getAllUsers(req)
    }
}
