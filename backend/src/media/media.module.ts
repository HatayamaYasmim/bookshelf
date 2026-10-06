import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { TmdbModule } from 'src/tmdb/tmdb.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [TmdbModule, PrismaModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
