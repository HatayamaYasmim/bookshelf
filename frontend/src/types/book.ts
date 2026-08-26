import type { Author } from './author';

export type ReadingStatus =
  | 'UNREAD'
  | 'READING'
  | 'READ';

export interface Book {
  id: number;
  title: string;
  status: ReadingStatus;
  readAt: string | null;

  authorId: number;
  author: Author;

  createdAt: string;
  updatedAt: string;
}

export interface BooksQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ReadingStatus;
  authorId?: number;
}

export interface BooksResponse {
  data: Book[];

  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}