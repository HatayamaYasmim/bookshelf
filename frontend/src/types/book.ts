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