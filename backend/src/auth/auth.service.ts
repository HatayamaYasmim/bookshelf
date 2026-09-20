import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailVerificationService } from './services/email-verification/email-verification.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly emailVerificationService: EmailVerificationService,
        private readonly mailService: MailService,) { }

    private readonly logger = new Logger(AuthService.name);

    async register(data: RegisterDto) {
        const email = data.email.trim().toLowerCase()
        const existingUser = await this.prisma.user.findUnique({ where: { email } })

        if (existingUser) {
            throw new ConflictException('Email already registered')
        }

        const passwordHash = await argon2.hash(data.password);
        const user = await this.prisma.user.create({
            data: { name: data.name.trim(), email, passwordHash },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerifiedAt: true,
                createdAt: true,
                updatedAt: true
            }
        })

        try {
            const verification =
                await this.emailVerificationService
                    .createToken(user.id);

            await this.mailService
                .sendEmailVerification({
                    email: user.email,
                    token: verification.token,
                });
        } catch (error) {
            this.logger.error(
                `Unable to send verification email for user ${user.id}`,
                error instanceof Error
                    ? error.stack
                    : undefined,
            );
        }

        return user

    }

    async login(data: LoginDto) {
        const email = data.email.trim().toLowerCase()
        const user = await this.prisma.user.findUnique({ where: { email } })

        if (!user) {
            throw new UnauthorizedException('Invalid email or password')
        }

        const passwordMatches = await argon2.verify(user.passwordHash, data.password)

        if (!passwordMatches) {
            throw new UnauthorizedException('Invalid email or password')
        }

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerifiedAt: user.emailVerifiedAt
            },
            accessToken,
        }
    }

    async getCurrentUser(userId: number) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerifiedAt: true,
                createdAt: true,
                updatedAt: true
            }
        })
    }

    async verifyEmail(token: string) {
        return this.emailVerificationService.verifyToken(token.trim());
    }

    async resendVerificationEmail(
        emailInput: string,
    ) {
        const email = emailInput.trim().toLowerCase();

        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                email: true,
                emailVerifiedAt: true,
            },
        });

        const response = { message: 'If the account exists and is not verified, a verification email has been sent.', };

        if (!user) {
            return response;
        }

        if (user.emailVerifiedAt) {
            return response;
        }

        try {
            const verification = await this.emailVerificationService.createToken(user.id);
            await this.mailService.sendEmailVerification({
                email: user.email,
                token: verification.token,
            });
        } catch (error) {
            this.logger.error(`Unable to resend verification email for user ${user.id}`,
                error instanceof Error
                    ? error.stack
                    : undefined,
            );
        }

        return response;
    }
}
