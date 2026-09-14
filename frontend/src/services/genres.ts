import type { Genre } from '../types/genre';

const apiUrl = import.meta.env.VITE_API_URL;

export async function getGenres(): Promise<Genre[]> {
  const url = `${apiUrl}/genre`;
  const response = await fetch(url, {credentials: 'include'});

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `Failed to fetch genres: ${response.status}`,
    );
  }

  return response.json();
}