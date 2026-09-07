import type { ReadingStatus } from "./book";

export interface MonthlyActivity {
  month: string;
  count: number;
}

export interface FavoriteGenre {
  id: number;
  name: string;
  count: number;
}

export interface CurrentlyReadingBook {
  id: number;
  title: string;
  status: ReadingStatus;

  author: {
    id: number;
    name: string;
  };

  genres: {
    id: number;
    name: string;
  }[];
}

export interface ReadingDashboardResponse {
  totalBooks: number;
  read: number;
  reading: number;
  unread: number;

  readThisMonth: number;
  readThisYear: number;

  monthlyActivity: MonthlyActivity[];
  favoriteGenres: FavoriteGenre[];
  currentlyReading: CurrentlyReadingBook[];
}