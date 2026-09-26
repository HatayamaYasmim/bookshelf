import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { CreateUserMediaDto } from './dto/create-user-media.dto';
import { MediaService } from './media.service';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';
import { UpdateMediaStatusDto } from './dto/update-media-status.dto';
import { UpdateMediaFavoriteDto } from './dto/update-media-favorite.dto';

@UseGuards(JwtAuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post() addToCollection(
    @Req() request: AuthenticatedRequest,
    @Body() data: CreateUserMediaDto,
  ) {
    return this.mediaService.addToCollection(request.user.userId, data);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.mediaService.findAllByUser(request.user.userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateMediaStatusDto,
  ) {
    return this.mediaService.updateStatus(request.user.userId, id, data);
  }

  @Patch(':id/favorite')
  updateFavorite(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateMediaFavoriteDto,
  ) {
    return this.mediaService.updateFavorite(
      request.user.userId,
      id,
      data.favorite,
    );
  }
}
