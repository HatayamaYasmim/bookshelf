import type { Author } from '../types/author';

const apiUrl = import.meta.env.VITE_API_URL;

export async function getAuthors(): Promise<Author[]> {
  const response = await fetch(`${apiUrl}/authors`);

  if (!response.ok) {
    throw new Error('Failed to load authors');
  }

  return response.json();
}

export interface CreateAuthorData {
  name: string;
}

export async function createAuthor(
  data: CreateAuthorData,
): Promise<Author> {
  const response = await fetch(`${apiUrl}/authors`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create author');
  }

  return response.json();
}