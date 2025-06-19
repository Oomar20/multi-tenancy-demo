import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
    constructor(private readonly users: UsersService) { }

    // GET /users/me/school 
    @Get('me/school')
    @Roles(Role.USER)
    getMySchool(@Req() req) {
        const tenantKey = (req.user as any).tenantKey as string | null;
        return this.users.getMySchool(tenantKey);
    }

    // GET /users/me/school
    @Get('me/grades')
    @Roles(Role.USER)
    async getMyGrades(@Req() req) {
        const userId = (req.user as any).sub as string;
        return this.users.getMyGrades(userId);
    }
}
