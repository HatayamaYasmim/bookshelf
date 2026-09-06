import type { Book, BooksQueryParams, BooksResponse, BooksStatsResponse, ReadingStatus } from '../types/book';

const apiUrl = import.meta.env.VITE_API_URL;

export async function getBooks(params: BooksQueryParams = {},): Promise<BooksResponse> {
  const query = new URLSearchParams();
  if (params.page) {
    query.set('page', String(params.page));
  }

  if (params.limit) {
    query.set('limit', String(params.limit));
  }

  if (params.search) {
    query.set('search', params.search);
  }

  if (params.status) {
    query.set('status', params.status);
  }

  if (params.authorId) {
    query.set('authorId', String(params.authorId));
  }

  const response = await fetch(`${apiUrl}/books?${query.toString()}`);

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

export interface CreateBookData {
  title: string;
  authorId: number;
  status: ReadingStatus;
}

export async function createBook(
  data: CreateBookData,
): Promise<Book> {
  const response = await fetch(`${apiUrl}/books`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create book');
  }

  return response.json();
}

export async function getBooksStats(): Promise<BooksStatsResponse> {
  const response = await fetch(
    `${apiUrl}/books/stats`,
  );

  if (!response.ok) {
    throw new Error('Failed to load book stats');
  }

  return response.json()
}

export async function deleteBook(id: number): Promise<void> {
  const response = await fetch(`${apiUrl}/books/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Failed to delete book')
  }
  return response.json();
}

export interface UpdateBookData {
  title: string
  authorId: number
  status: ReadingStatus
}

interface UpdateBookParams {
  id: number
  data: UpdateBookData
}

export async function updateBook({
  id, data
}: UpdateBookParams): Promise<Book> {
  const response = await fetch(
    `${apiUrl}/books/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }
  )
  if (!response.ok) {
    throw new Error('Failed to update book')
  }
  return response.json()
}