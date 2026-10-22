import { Module } from '@nestjs/common';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { MediaModule } from 'src/media/media.module';
import { TmdbModule } from 'src/tmdb/tmdb.module';
import { OpenRouterService } from './openrouter.service';

@Module({
  imports: [MediaModule, TmdbModule],
  controllers: [AiController],
  providers: [AiService, OpenRouterService],
})
export class AiModule {}