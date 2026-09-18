import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
    constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @Get('reading')
  getReadingDashboard(@Req() request: AuthenticatedRequest) {
    return this.dashboardService.getReadingDashboard( request.user.userId);
  }
}
