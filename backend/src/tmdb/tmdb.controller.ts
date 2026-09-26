import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TmdbService } from './tmdb.service';

@UseGuards(JwtAuthGuard)
@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Get('search')
  search(@Query('query') query: string, @Query('language') language?: string) {
    return this.tmdbService.search(query, language);
  }
}
