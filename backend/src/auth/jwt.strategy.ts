import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';

export interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
    tenantKey: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(cfg: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: cfg.get('JWT_SECRET'),
        });
    }

    validate(payload: JwtPayload) {
        return payload;
    }
}
