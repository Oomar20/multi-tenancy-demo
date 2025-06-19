import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from 'src/admin/dto/create-tenant.dto';
import { CreateGradeDto } from './dto/create-grade.dto';
import { AssignGradeDto } from './dto/assign-grade.dto';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async createTenant(dto: CreateTenantDto) {
        try {
            return await this.prisma.school.create({
                data: { name: dto.name, tenantKey: dto.tenantKey },
            });
        } catch (e) {
            throw new ConflictException('tenantKey already exists');
        }
    }

    async createGrade(dto: CreateGradeDto) {
        // finding school
        const school = await this.prisma.school.findUnique({
            where: { tenantKey: dto.tenantKey },
        });
        if (!school) {
            throw new NotFoundException(
                `No school found with tenantKey “${dto.tenantKey}”`,
            );
        }

        // attempting to create the grade
        try {
            return await this.prisma.grade.create({
                data: {
                    level: dto.level,
                    section: dto.section,
                    tenantKey: dto.tenantKey,
                    schoolId: school.id,
                },
            });
        } catch (e: any) {
            // unique constraint on (schoolId, level, section, tenantKey)
            if (e.code === 'P2002' && e.meta?.target?.includes('schoolId_level_section_tenantKey')) {
                throw new ConflictException(
                    `Grade ${dto.level}-${dto.section} already exists for this school`,
                );
            }
            throw e;
        }
    }

    async assignGrade(dto: AssignGradeDto) {
        // verifying user exists 
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId },
        });
        if (!user) {
            throw new NotFoundException(`No user found with ID ${dto.userId}`);
        }

        // verifying grade exists
        const grade = await this.prisma.grade.findUnique({
            where: { id: dto.gradeId },
        });
        if (!grade) {
            throw new NotFoundException(`No grade found with ID ${dto.gradeId}`);
        }

        // checking for tenant-consistency 
        if (user.tenantKey !== grade.tenantKey) {
            throw new ConflictException(
                `User’s tenant (${user.tenantKey}) does not match grade’s tenant (${grade.tenantKey})`
            );
        }

        // attempting to link
        try {
            return await this.prisma.userGrade.create({
                data: {
                    userId: dto.userId,
                    gradeId: dto.gradeId,
                },
            });
        } catch (e: any) {
            if (e.code === 'P2002') {
                throw new ConflictException(
                    `User is already assigned to this grade`
                );
            }
            throw e;
        }
    }
}