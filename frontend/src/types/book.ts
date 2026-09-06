import type { Author } from './author';
import type { Genre } from './genre';

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

  genres: Genre[];
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

export interface BooksStatsResponse {
  total: number;
  read: number;
  reading: number;
  unread: number;
}
