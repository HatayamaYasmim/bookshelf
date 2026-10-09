import type { AiRecommendationsResponse } from '../../../types/ai';

const STORAGE_KEY = 'bookshelf:ai-recommendations';
const TTL = 24 * 60 * 60 * 1000;

interface StoredRecommendations {
  generatedAt: number;
  data: AiRecommendationsResponse;
}

export function getStoredRecommendations(): AiRecommendationsResponse | null {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as StoredRecommendations;

    const expired = Date.now() - parsed.generatedAt > TTL;

    if (expired) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed.data;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveRecommendations(data: AiRecommendationsResponse) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      generatedAt: Date.now(),
      data,
    }),
  );
}
