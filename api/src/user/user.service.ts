import { Request } from 'express';
import { AuthService } from './../auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {

    HOURS_TO_VERIFY = 4;
    HOURS_TO_BLOCK = 6;
    LOGIN_ATTEMPTS_TO_BLOCK = 5;

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly authService: AuthService,
    ) { }

    async create(req: Request, createUserDto: CreateUserDto): Promise<User> {
        const user = new this.userModel(createUserDto);
        await this.isEmailUnique(user.email);
        await user.save();
        return this.buildRegistrationInfo(user);
    }

    async getUserById(_id: string): Promise<User> {
        const user = await this.userModel.findOne({ _id })
        if (!user) {
            throw new NotFoundException('User not found.');
        }
        return user
    }

    async updateUser(user: UpdateUserDto): Promise<User> {
        const User = await this.userModel.findOne({ _id: user._id })
        if (!User) {
            throw new NotFoundException('User not found.');
        }
        User.roles = user.roles;
        User.email = user.email;
        User.password = user.password;
        await User.save();
        return User
    }

    async login(req: Request, loginUserDto: LoginUserDto) {
        const user = await this.findUserByEmail(loginUserDto.email);
        if (!user) {
            throw new NotFoundException('Wrong email or password.');
        }
        await this.checkPassword(loginUserDto.password, user);
        return {
            fullName: user.fullName,
            email: user.email,
            roles: user.roles,
            accessToken: await this.authService.createAccessToken(user._id),
            refreshToken: await this.authService.createRefreshToken(req, user._id),
        };
    }

    async loginByAuth(req) {
        const user = req.user;
        return {
            fullName: user.fullName,
            email: user.email,
            roles: user.roles,
            accessToken: await this.authService.createAccessToken(user._id),
            refreshToken: await this.authService.createRefreshToken(req, user._id),
        };
    }

    async getAllUsers(req) {
        const reqUser = req.user as User;
        let search = { roles: 'user' }
        if (reqUser?.roles.includes('user')) {
            search['_id'] = reqUser._id
        }
        return await this.userModel
            .find(search)
            .select({
                _id: 1,
                fullName: 1,
                email: 1,
            });
    }

    async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
        const userId = await this.authService.findRefreshToken(refreshAccessTokenDto.refreshToken);
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new BadRequestException('Bad request');
        }
        return {
            accessToken: await this.authService.createAccessToken(user._id),
        };
    }

    private async isEmailUnique(email: string) {
        const user = await this.userModel.findOne({ email });
        if (user) {
            throw new BadRequestException('Email most be unique.');
        }
    }

    private buildRegistrationInfo(user): any {
        const userRegistrationInfo = {
            fullName: user.fullName,
            email: user.email,
            verified: user.verified,
        };
        return userRegistrationInfo;
    }

    private async findUserByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new NotFoundException('Wrong email or password.');
        }
        return user;
    }

    private async checkPassword(attemptPass: string, user) {
        const match = await bcrypt.compare(attemptPass, user.password);
        if (!match) {
            throw new NotFoundException('Wrong email or password.');
        }
        return match;
    }
}
