import { Controller, Post, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';
import { CreateTenantDto } from 'src/admin/dto/create-tenant.dto';
import { AdminService } from './admin.service';
import { Roles } from 'src/common/roles.decorator';
import { CreateGradeDto } from './dto/create-grade.dto';
import { AssignGradeDto } from './dto/assign-grade.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) { }


    @Post('tenants')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'))
    createTenant(@Body(new ValidationPipe({ whitelist: true })) dto: CreateTenantDto) {
        return this.adminService.createTenant(dto);
    }

    @Post('grades')
    @Roles(Role.ADMIN)
    createGrade(
        @Body(new ValidationPipe({ whitelist: true }))
        dto: CreateGradeDto,
    ) {
        return this.adminService.createGrade(dto);
    }

    @Post('assign-grade')
    @Roles(Role.ADMIN)
    assignGrade(
        @Body(new ValidationPipe({ whitelist: true }))
        dto: AssignGradeDto,
    ) {
        return this.adminService.assignGrade(dto);
    }
}