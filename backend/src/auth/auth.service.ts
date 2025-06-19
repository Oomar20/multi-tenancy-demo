import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        // ensuring tenant exists
        const school = await this.prisma.school.findUnique({ where: { tenantKey: dto.tenantKey } });
        if (!school) {
            throw new UnauthorizedException('Invalid tenantKey');
        }

        const hash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hash,
                tenantKey: dto.tenantKey,
                role: Role.USER,
            },
        });

        // checking for tenantKey
        if (!user.tenantKey) {
            throw new InternalServerErrorException('New user has no tenantKey');
        }

        return this.signToken(user.id, user.email, user.role, user.tenantKey);
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Allow ADMIN without tenantKey, enforce for others
        if (user.role !== Role.ADMIN && !user.tenantKey) {
            throw new UnauthorizedException('Your account has no tenant assigned');
        }

        // for admins, tenantKey may be null
        const tenantKey = user.tenantKey ?? null;

        return this.signToken(user.id, user.email, user.role, tenantKey);
    }

    private signToken(
        userId: string,
        email: string,
        role: Role,
        tenantKey: string | null,
    ) {
        const payload = { sub: userId, email, role, tenantKey };
        return { access_token: this.jwt.sign(payload) };
    }
}
