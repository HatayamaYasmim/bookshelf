import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [PrismaModule,
  JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (
                configService: ConfigService,
            ) => {
                const secret =
                    configService.get<string>('JWT_SECRET');

                if (!secret) {
                    throw new Error(
                        'JWT_SECRET is not configured',
                    );
                }

                return {
                    secret,
                    signOptions: {
                        expiresIn: '15m',
                    },
                };
            },
        }),
    ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
