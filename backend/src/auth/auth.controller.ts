import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { VerifyEmailDto } from './dto/verify-email.dto';
import type { AuthenticatedRequest } from './types/authenticated-request';
import { ResendVerificationDto } from './dto/resend-verification.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('register')
    register(@Body() data: RegisterDto) {
        return this.authService.register(data);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body() data: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const result =
            await this.authService.login(data);

        const isProduction =
            process.env.NODE_ENV === 'production';

        response.cookie(
            'access_token',
            result.accessToken,
            {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction
                    ? 'none'
                    : 'lax',
                maxAge: 15 * 60 * 1000,
                path: '/',
            },
        );

        return {
            user: result.user,
        };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(
        @Req() request: AuthenticatedRequest,
    ) {
        return this.authService.getCurrentUser(
            request.user.userId,
        );
    }

    @Post('logout')
    logout(
        @Res({ passthrough: true }) response: Response,
    ) {
        const isProduction =
            process.env.NODE_ENV === 'production';

        response.clearCookie(
            'access_token',
            {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction
                    ? 'none'
                    : 'lax',
                path: '/',
            },
        );

        return {
            message:
                'Logged out successfully',
        };
    }

    @HttpCode(HttpStatus.OK)
    @Post('verify-email')
    verifyEmail(
        @Body() data: VerifyEmailDto,
    ) {
        return this.authService.verifyEmail(
            data.token,
        );
    }

    @HttpCode(HttpStatus.OK)
    @Post('resend-verification')
    resendVerification(
        @Body() data: ResendVerificationDto,
    ) {
        return this.authService
            .resendVerificationEmail(
                data.email,
            );
    }
}