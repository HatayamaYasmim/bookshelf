import type { Book, ReadingStatus } from '../types/book';

const apiUrl = import.meta.env.VITE_API_URL;

export async function getBooks(): Promise<Book[]> {
  const response = await fetch(`${apiUrl}/books`);

  if (!response.ok) {
    throw new Error('Failed to load books');
  }

  return response.json();
}


interface UpdateBookStatusParams {
  id: number;
  status: ReadingStatus;
}

export async function updateBookStatus({
  id,
  status,
}: UpdateBookStatusParams): Promise<Book> {
  const response = await fetch(
    `${apiUrl}/books/${id}/status`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        status,
      }),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to update book status');
  }

  return response.json();
}