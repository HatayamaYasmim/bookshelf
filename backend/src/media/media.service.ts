import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { TmdbService } from 'src/tmdb/tmdb.service';

import { CreateUserMediaDto } from './dto/create-user-media.dto';
import { UpdateMediaStatusDto } from './dto/update-media-status.dto';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tmdbService: TmdbService,
  ) {}

  async addToCollection(userId: number, data: CreateUserMediaDto) {
    const tmdbMedia = await this.tmdbService.getMediaDetails(
      data.tmdbId,
      data.type,
    );

    const releaseDate = tmdbMedia.releaseDate
      ? new Date(`${tmdbMedia.releaseDate}T00:00:00.000Z`)
      : null;

    return this.prisma.$transaction(async (tx) => {
      const media = await tx.media.upsert({
        where: {
          tmdbId_type: {
            tmdbId: tmdbMedia.tmdbId,
            type: tmdbMedia.type,
          },
        },
        update: {
          title: tmdbMedia.title,
          overview: tmdbMedia.overview,
          posterPath: tmdbMedia.posterPath,
          backdropPath: tmdbMedia.backdropPath,
          releaseDate,
          rating: tmdbMedia.rating,
        },
        create: {
          tmdbId: tmdbMedia.tmdbId,
          type: tmdbMedia.type,
          title: tmdbMedia.title,
          overview: tmdbMedia.overview,
          posterPath: tmdbMedia.posterPath,
          backdropPath: tmdbMedia.backdropPath,
          releaseDate,
          rating: tmdbMedia.rating,
        },
      });

      return tx.userMedia.upsert({
        where: {
          userId_mediaId: {
            userId,
            mediaId: media.id,
          },
        },
        update: {},
        create: {
          userId,
          mediaId: media.id,
        },
        include: {
          media: true,
        },
      });
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.userMedia.findMany({
      where: {
        userId,
      },
      include: {
        media: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStatus(
    userId: number,
    userMediaId: number,
    data: UpdateMediaStatusDto,
  ) {
    const userMedia = await this.prisma.userMedia.findFirst({
      where: {
        id: userMediaId,
        userId,
      },
    });

    if (!userMedia) {
      throw new NotFoundException('Media not found in user collection');
    }

    return this.prisma.userMedia.update({
      where: {
        id: userMedia.id,
      },
      data: {
        status: data.status,
      },
      include: {
        media: true,
      },
    });
  }

  async updateFavorite(userId: number, userMediaId: number, favorite: boolean) {
    const userMedia = await this.prisma.userMedia.findFirst({
      where: {
        id: userMediaId,
        userId,
      },
    });

    if (!userMedia) {
      throw new NotFoundException('Media not found in user collection');
    }

    return this.prisma.userMedia.update({
      where: {
        id: userMedia.id,
      },
      data: {
        favorite,
      },
      include: {
        media: true,
      },
    });
  }
}
