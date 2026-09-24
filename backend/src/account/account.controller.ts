import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AccountService } from './account.service';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateProfileDto } from './dto/update.profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@UseGuards(JwtAuthGuard)
@Controller('account')
export class AccountController {
    constructor( private readonly accountService: AccountService) {}
    
    @Get('preferences')
    getPreferences(@Req() request: AuthenticatedRequest) {
        return this.accountService.getPreferences(
            request.user.userId,
        );
    }

    @Patch('preferences')
    updatePreferences(@Req() request: AuthenticatedRequest, @Body() data: UpdatePreferencesDto) {
        return this.accountService.updatePreferences(request.user.userId, data)
    }

    @Patch('profile')
    updateProfile(@Req() request: AuthenticatedRequest, @Body() data: UpdateProfileDto) {
        return this.accountService.updateProfile(request.user.userId, data)
    }

    // Temporarily disabled until password recovery flow is available.
    // @Patch('password')
    // updatePassword(@Req() request: AuthenticatedRequest, @Body() data: ChangePasswordDto){
    //     return this.accountService.updatePassword(request.user.userId, data)
    // }

}
