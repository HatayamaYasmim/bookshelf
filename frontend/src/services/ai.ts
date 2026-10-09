import type { AiRecommendationsResponse } from '../types/ai';
import { apiJson } from './api';

export async function getAiRecommendations() {
  return apiJson<AiRecommendationsResponse>('/ai/recommendations');
}
