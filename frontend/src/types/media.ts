export type MediaType = 'MOVIE' | 'TV';

export type MediaStatus = 'WATCHLIST' | 'WATCHING' | 'WATCHED';

export interface Media {
  id: number;
  tmdbId: number;
  type: MediaType;
  title: string;
  overview: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  rating: number | null;
}

export interface UserMedia {
  id: number;
  status: MediaStatus;
  favorite: boolean;
  userId: number;
  mediaId: number;
  createdAt: string;
  updatedAt: string;
  media: Media;
}

export interface TmdbSearchResult {
  id: number;
  type: MediaType;
  title: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  rating: number;
}

export interface TmdbSearchResponse {
  page: number;
  totalPages: number;
  totalResults: number;
  results: TmdbSearchResult[];
}