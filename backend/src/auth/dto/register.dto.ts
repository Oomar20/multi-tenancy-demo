import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
    @IsEmail() email: string;
    @IsNotEmpty() tenantKey: string;
    @MinLength(6) password: string;
}