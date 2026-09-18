import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class AccountService {
    constructor( private readonly prisma: PrismaService) {}

    async getPreferences(userId: number) {
        const preferences = await this.prisma.userPreference.findUnique({
            where: {userId},
            select: {
                theme: true,
                primaryColor: true
            }
        })

        if(!preferences) {
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
}
