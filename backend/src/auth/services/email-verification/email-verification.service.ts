import { BadRequestException, Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmailVerificationService {
    constructor(private readonly prisma: PrismaService) { }

    async createToken(userId: number) {
        const token = randomBytes(32).toString('hex');
        const tokenHash = this.hashToken(token);
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

        await this.prisma.$transaction([this.prisma.emailVerificationToken.deleteMany({ where: { userId } }),
        this.prisma.emailVerificationToken.create({
            data: {
                userId,
                tokenHash,
                expiresAt
            }
        })
        ])
        return { token, expiresAt }
    }
    private hashToken(token: string) { return createHash('sha256').update(token).digest('hex') }

    async verifyToken(token: string) {
        const tokenHash = this.hashToken(token);

        const verificationToken = await this.prisma.emailVerificationToken.findUnique({
            where: {
                tokenHash,
            },
        });

        if (!verificationToken) {
            throw new BadRequestException('Invalid or expired verification token',);
        }

        if (verificationToken.expiresAt < new Date()) {
            await this.prisma.emailVerificationToken.delete({
                where: { id: verificationToken.id, },
            });

            throw new BadRequestException('Invalid or expired verification token',);
        }

        await this.prisma.$transaction([this.prisma.user.update({
            where: { id: verificationToken.userId, },
            data: { emailVerifiedAt: new Date(), },
        }),

        this.prisma.emailVerificationToken.deleteMany({
            where: { userId: verificationToken.userId, },
        }),
        ]);

        return {
            message: 'Email verified successfully',
        };
    }
}
