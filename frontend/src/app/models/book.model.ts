import { Author } from "./author.models";

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