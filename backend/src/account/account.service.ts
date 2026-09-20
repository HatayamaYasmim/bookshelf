import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { EmailVerificationService } from 'src/auth/services/email-verification/email-verification.service';
import { MailService } from 'src/mail/mail.service';
import { UpdateProfileDto } from './dto/update.profile.dto';
import { CUSTOM_ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

@Injectable()
export class AccountService {
    constructor(private readonly prisma: PrismaService,
        private readonly mailService: MailService,
        private readonly emailVerificationService: EmailVerificationService
    ) { }

    private readonly logger = new Logger(AccountService.name);

    async getPreferences(userId: number) {
        const preferences = await this.prisma.userPreference.findUnique({
            where: { userId },
            select: {
                theme: true,
                primaryColor: true
            }
        })

        if (!preferences) {
            return {
                theme: 'SYSTEM',
                primaryColor: 'indigo'
            }
        }
        return preferences;
    }


    async updatePreferences(
        userId: number,
        data: UpdatePreferencesDto,
    ) {
        return this.prisma.userPreference.upsert({
            where: {
                userId,
            },
            create: {
                userId,
                theme: data.theme ?? 'SYSTEM',
                primaryColor:
                    data.primaryColor ?? 'indigo',
            },
            update: {
                ...(data.theme && {
                    theme: data.theme,
                }),
                ...(data.primaryColor && {
                    primaryColor: data.primaryColor,
                }),
            },
            select: {
                theme: true,
                primaryColor: true,
            },
        });
    }

    async updateProfile(userId: number, data: UpdateProfileDto) {
        const currentUser = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerifiedAt: true
            },
        })
        if (!currentUser) {
            throw new NotFoundException(`User not found`)
        }

        const name = data.name?.trim()
        const email = data.email?.trim()

        const emailChanged = email !== undefined && email !== currentUser.email

        if (emailChanged) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email },
                select: {
                    id: true
                }
            })

            if (existingUser && existingUser.id !== userId) {
                throw new ConflictException('Email already registered')
            }
        }

        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(name !== undefined && {
                    name,
                }),
                ...(emailChanged && {
                    email,
                    emailVerifiedAt: null,
                }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerifiedAt: true,
                createdAt: true,
                updatedAt: true,
            }
        })

        if (emailChanged) {
            try {
                const verification = await this.emailVerificationService.createToken(user.id)
                await this.mailService.sendEmailVerification({ email: user.email, token: verification.token })

            } catch (error) {
                this.logger.error(
                    `Unable to send verification email for user ${user.id}`,
                    error instanceof Error
                        ? error.stack
                        : undefined,
                )
            }

        }
        return user
    }
}
