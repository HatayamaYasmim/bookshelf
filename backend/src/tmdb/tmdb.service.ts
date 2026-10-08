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

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbDiscoverItem {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
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

  private async getGenres(
    type: 'MOVIE' | 'TV',
    language = 'pt-BR',
  ): Promise<TmdbGenre[]> {
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
      `${this.baseUrl}/genre/${mediaType}/list?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new InternalServerErrorException('Failed to load TMDB genres');
    }

    const data = await response.json();

    return data.genres as TmdbGenre[];
  }

  async discoverByGenres(genres: string[], language = 'pt-BR') {
    const token = process.env.TMDB_ACCESS_TOKEN;

    if (!token) {
      throw new InternalServerErrorException(
        'TMDB access token is not configured',
      );
    }

    const [movieGenres, tvGenres] = await Promise.all([
      this.getGenres('MOVIE', language),
      this.getGenres('TV', language),
    ]);

    const normalize = (value: string) => value.trim().toLowerCase();

    const movieGenreIds = movieGenres
      .filter((genre) =>
        genres.some(
          (profileGenre) => normalize(profileGenre) === normalize(genre.name),
        ),
      )
      .map((genre) => genre.id);

    const tvGenreIds = tvGenres
      .filter((genre) =>
        genres.some(
          (profileGenre) => normalize(profileGenre) === normalize(genre.name),
        ),
      )
      .map((genre) => genre.id);

    const fetchDiscover = async (type: 'MOVIE' | 'TV', genreIds: number[]) => {
      if (genreIds.length === 0) {
        return [];
      }

      const mediaType = type === 'MOVIE' ? 'movie' : 'tv';

      const params = new URLSearchParams({
        language,
        include_adult: 'false',
        page: '1',
        sort_by: 'popularity.desc',
        with_genres: genreIds.join('|'),
        'vote_count.gte': '100',
      });

      const response = await fetch(
        `${this.baseUrl}/discover/${mediaType}?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new InternalServerErrorException(
          `Failed to discover TMDB ${mediaType}`,
        );
      }

      const data = await response.json();

      return (data.results as TmdbDiscoverItem[]).map((item) => ({
        id: item.id,
        type,
        title: type === 'MOVIE' ? item.title : item.name,
        overview: item.overview ?? '',
        posterUrl: item.poster_path
          ? `${this.imageBaseUrl}${item.poster_path}`
          : null,
        backdropUrl: item.backdrop_path
          ? `${this.imageBaseUrl}${item.backdrop_path}`
          : null,
        releaseDate:
          type === 'MOVIE'
            ? (item.release_date ?? null)
            : (item.first_air_date ?? null),
        rating: item.vote_average ?? 0,
        voteCount: item.vote_count ?? 0,
      }));
    };

    const [movies, tvShows] = await Promise.all([
      fetchDiscover('MOVIE', movieGenreIds),
      fetchDiscover('TV', tvGenreIds),
    ]);

    return [...movies, ...tvShows];
  }

  async findSuggestedMedia(
    title: string,
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
      query: title,
      language,
      include_adult: 'false',
      page: '1',
    });

    const response = await fetch(
      `${this.baseUrl}/search/${mediaType}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new InternalServerErrorException(
        'Failed to validate TMDB recommendation',
      );
    }

    const data = await response.json();

    const item = data.results?.[0];

    if (!item) {
      return null;
    }

    return {
      tmdbId: item.id,
      type,
      title: type === 'MOVIE' ? item.title : item.name,
      overview: item.overview ?? '',
      posterUrl: item.poster_path
        ? `${this.imageBaseUrl}${item.poster_path}`
        : null,
      backdropUrl: item.backdrop_path
        ? `${this.imageBaseUrl}${item.backdrop_path}`
        : null,
      releaseDate:
        type === 'MOVIE'
          ? (item.release_date ?? null)
          : (item.first_air_date ?? null),
      rating: item.vote_average ?? 0,
    };
  }
}
