import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    readonly _id: string;

    // fullName
    @IsNotEmpty()
    @IsString()
    readonly fullName: string;

    // Email
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    // Password
    @IsNotEmpty()
    @IsString()
    readonly password: string;
    readonly roles: string;
}
