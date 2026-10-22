import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';

import { AiService } from './ai.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AiChatDto } from './dto/ai-chat.dto';
import { AiCuratorService } from './ai-curator.service';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
constructor(
  private readonly aiService: AiService,
  private readonly aiCuratorService: AiCuratorService,
) {}

  @Get('profile')
  generateProfile(@Req() request: AuthenticatedRequest) {
    return this.aiService.generateMediaProfile(request.user.userId);
  }

  @Get('recommendations')
  generateRecommendations(@Req() request: AuthenticatedRequest) {
    return this.aiService.generateRecommendations(request.user.userId);
  }

  @Post('chat')
  chat(@Req() request: AuthenticatedRequest, @Body() body: AiChatDto) {
    return this.aiCuratorService.chat(request.user.userId, body.message);
  }
}
