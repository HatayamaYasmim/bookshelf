import { apiJson } from '../../../services/api';

import type { MediaStatus, MediaType, TmdbSearchResponse, UserMedia } from '../../../types/media';

interface AddMediaInput {
  tmdbId: number;
  type: MediaType;
  status?: MediaStatus | null;
  favorite?: boolean;
}

export async function searchMedia(query: string, language: string) {
  const params = new URLSearchParams({
    query,
    language,
  });

  return apiJson<TmdbSearchResponse>(`/tmdb/search?${params.toString()}`);
}

export async function getUserMedia() {
  return apiJson<UserMedia[]>('/media');
}

export async function addMediaToCollection(data: AddMediaInput) {
  return apiJson<UserMedia>('/media', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function updateMediaStatus(id: number, status: MediaStatus) {
  return apiJson<UserMedia>(`/media/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status,
    }),
  });
}

export async function updateMediaFavorite(id: number, favorite: boolean) {
  return apiJson<UserMedia>(`/media/${id}/favorite`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      favorite,
    }),
  });
}
