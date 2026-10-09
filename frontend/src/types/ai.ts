export type MediaRecommendationType = 'MOVIE' | 'TV';

export interface AiTasteProfile {
  summary: string;
  genres: string[];
  themes: string[];
  mood: string[];
}

export interface AiRecommendation {
  tmdbId: number;
  type: MediaRecommendationType;
  title: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  rating: number;
}

export interface AiRecommendationsResponse {
  profile: AiTasteProfile;
  recommendations: AiRecommendation[];
}
