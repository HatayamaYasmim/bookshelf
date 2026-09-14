import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async register(data: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({ where:{ email: data.email}})

        if(existingUser){ 
            throw new ConflictException('Email already registered')
        }

        const passwordHash = await argon2.hash(data.password);
        const user = await this.prisma.user.create({
            data: { name: data.name, email: data.email, passwordHash },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        })

        return user
    }

    async login(data: LoginDto) {
        const user = await this.prisma.user.findUnique({ where: { email: data.email}})

        if(!user) {
            throw new UnauthorizedException('Invalid email or password')
        }

        const passwordMatches = await argon2.verify(user.passwordHash, data.password)

        if(!passwordMatches){
            throw new  UnauthorizedException('Invalid email or password')
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email
        }
    }
}
