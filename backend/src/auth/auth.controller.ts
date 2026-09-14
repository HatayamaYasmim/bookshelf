import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
    user: {
        userId: number;
    };
}
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() data: RegisterDto) {
        return this.authService.register(data)
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() data: LoginDto, @Res({ passthrough: true }) response: Response) {
        const result = await this.authService.login(data)

        response.cookie('access_token', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
            path: '/'
        }
        )
        return {
            user: result.user,
        }
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@Req() request: AuthenticatedRequest) {
        return this.authService.getCurrentUser(request.user.userId)
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        })

        return {
            message: 'Logged out successfully',
        };
    }


}
