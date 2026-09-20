import type { Genre } from '../types/genre';
import { apiFetch } from './api';

export async function getGenres(): Promise<Genre[]> {
  const response = await apiFetch('/genre');
  if (!response.ok) {
    throw new Error(
      `Failed to fetch genres: ${response.status}`,
    );
  }

  return response.json();
}