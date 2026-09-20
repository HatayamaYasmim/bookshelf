import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { Request } from 'express';

interface JwtPayload {
    sub: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        const secret = configService.get<string>('JWT_SECRET')

        if(!secret) {
            throw new Error('JWT_SECRET is not configured')
        }

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => { return request?.cookies?.access_token ?? null}
            ]),
        ignoreExpiration: false,
        secretOrKey: secret
        })
    }

    validate(payload: JwtPayload) {
        return {
            userId: payload.sub
        }
    }
}