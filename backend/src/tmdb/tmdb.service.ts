import { Injectable, InternalServerErrorException } from '@nestjs/common';

interface TmdbSearchItem {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
}

@Injectable()
export class TmdbService {
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private readonly imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  async search(query: string, language = 'pt-BR') {
    const token = process.env.TMDB_ACCESS_TOKEN;

    if (!token) {
      throw new InternalServerErrorException(
        'TMDB access token is not configured',
      );
    }

    const params = new URLSearchParams({
      query,
      language,
      include_adult: 'false',
      page: '1',
    });

    const response = await fetch(
      `${this.baseUrl}/search/multi?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new InternalServerErrorException('Failed to search TMDB');
    }

    const data = await response.json();

    const results = (data.results as TmdbSearchItem[])
      .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
      .map((item) => ({
        id: item.id,
        type: item.media_type === 'movie' ? 'MOVIE' : 'TV',
        title: item.media_type === 'movie' ? item.title : item.name,
        overview: item.overview ?? '',
        posterUrl: item.poster_path
          ? `${this.imageBaseUrl}${item.poster_path}`
          : null,
        backdropUrl: item.backdrop_path
          ? `${this.imageBaseUrl}${item.backdrop_path}`
          : null,
        releaseDate:
          item.media_type === 'movie'
            ? (item.release_date ?? null)
            : (item.first_air_date ?? null),
        rating: item.vote_average ?? 0,
      }));

    return {
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      results,
    };
  }

  async getMediaDetails(
    tmdbId: number,
    type: 'MOVIE' | 'TV',
    language = 'pt-BR',
  ) {
    const token = process.env.TMDB_ACCESS_TOKEN;

    if (!token) {
      throw new InternalServerErrorException(
        'TMDB access token is not configured',
      );
    }

    const mediaType = type === 'MOVIE' ? 'movie' : 'tv';

    const params = new URLSearchParams({
      language,
    });

    const response = await fetch(
      `${this.baseUrl}/${mediaType}/${tmdbId}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new InternalServerErrorException(
        'Failed to load TMDB media details',
      );
    }

    const data = await response.json();

    return {
      tmdbId: data.id,
      type,
      title: type === 'MOVIE' ? data.title : data.name,
      overview: data.overview || null,
      posterPath: data.poster_path || null,
      backdropPath: data.backdrop_path || null,
      releaseDate:
        type === 'MOVIE'
          ? data.release_date || null
          : data.first_air_date || null,
      rating: data.vote_average ?? null,
    };
  }
}
