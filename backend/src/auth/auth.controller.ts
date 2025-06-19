import { Controller, Post, Body, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) { }

    @Post('register')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    register(
        @Body(new ValidationPipe({ whitelist: true }))
        dto: RegisterDto
    ) {
        return this.auth.register(dto);
    }

    @Post('login')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    login(@Body() dto: LoginDto) {
        return this.auth.login(dto);
    }
}