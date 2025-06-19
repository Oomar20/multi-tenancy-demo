import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async getMySchool(tenantKey: string | null) {
        if (!tenantKey) {
            throw new NotFoundException('You are not assigned to any school');
        }
        const school = await this.prisma.school.findUnique({
            where: { tenantKey },
            select: { name: true, tenantKey: true },
        });
        if (!school) {
            throw new NotFoundException(`School with key "${tenantKey}" not found`);
        }
        return school;
    }

    async getMyGrades(userId: string) {
        const record = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                grades: {
                    select: {
                        grade: {
                            select: { id: true, level: true, section: true, tenantKey: true },
                        },
                    },
                },
            },
        });

        if (!record) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        // flatten to an array of Grade objects
        return record.grades.map(({ grade }) => grade);
    }
}
