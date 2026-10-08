import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';

import { AiService } from './ai.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('profile')
  generateProfile(@Req() request: AuthenticatedRequest) {
    return this.aiService.generateMediaProfile(request.user.userId);
  }

  @Get('recommendations')
  generateRecommendations(@Req() request: AuthenticatedRequest) {
    return this.aiService.generateRecommendations(request.user.userId);
  }
}
