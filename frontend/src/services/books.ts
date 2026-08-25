import type { Book } from '../types/book';

const apiUrl = import.meta.env.VITE_API_URL;

export async function getBooks(): Promise<Book[]> {
  const response = await fetch(`${apiUrl}/books`);

  if (!response.ok) {
    throw new Error('Failed to load books');
  }

  return response.json();
}