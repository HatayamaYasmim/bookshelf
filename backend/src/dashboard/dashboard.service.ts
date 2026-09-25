import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DateTime } from 'luxon';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getReadingDashboard(userId: number, timeZone?: string) {
    const userTimeZone = this.resolveTimeZone(timeZone);
    const now = DateTime.now().setZone(userTimeZone);

    const startOfMonth = now.startOf('month').toUTC().toJSDate();
    const startOfNextMonth = now
      .plus({ months: 1 })
      .startOf('month')
      .toUTC()
      .toJSDate();

    const startOfYear = now.startOf('year').toUTC().toJSDate();
    const startOfNextYear = now
      .plus({ years: 1 })
      .startOf('year')
      .toUTC()
      .toJSDate();

    const startOfSixMonths = now
      .minus({ months: 5 })
      .startOf('month')
      .toUTC()
      .toJSDate();

    const [
      totalBooks,
      read,
      reading,
      unread,
      readThisMonth,
      readThisYear,
      readingHistoryLastSixMonths,
      readBooksWithGenres,
      currentlyReading,
    ] = await Promise.all([
      this.prisma.book.count({ where: { userId } }),

      this.prisma.book.count({
        where: {
          userId,
          status: 'READ',
        },
      }),

      this.prisma.book.count({
        where: {
          userId,
          status: 'READING',
        },
      }),

      this.prisma.book.count({
        where: {
          userId,
          status: 'UNREAD',
        },
      }),

      // Reading completions during the current month
      this.prisma.readingHistory.count({
        where: {
          book: { userId },
          completedAt: {
            gte: startOfMonth,
            lt: startOfNextMonth,
          },
        },
      }),

      // Reading completions during the current year
      this.prisma.readingHistory.count({
        where: {
          book: { userId },
          completedAt: {
            gte: startOfYear,
          },
        },
      }),

      // Reading completions during the last six months
      this.prisma.readingHistory.findMany({
        where: {
          book: { userId },
          completedAt: {
            gte: startOfSixMonths,
            lt: startOfNextMonth,
          },
        },
        select: {
          completedAt: true,
        },
      }),

      // Genres from currently completed books
      this.prisma.book.findMany({
        where: {
          userId,
          readingHistory: {
            some: {},
          },
        },
        select: {
          genres: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      // Books that are currently being read
      this.prisma.book.findMany({
        where: {
          userId,
          status: 'READING',
        },
        select: {
          id: true,
          title: true,
          status: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          genres: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
    ]);

    const monthlyActivity = Array.from({ length: 6 }, (_, index) => {
      const date = now.minus({ months: 5 - index });

      return {
        month: date.toFormat('yyyy-MM'),
        count: 0,
      };
    });

    const genreCounts = new Map<
      number,
      {
        id: number;
        name: string;
        count: number;
      }
    >();

    for (const book of readBooksWithGenres) {
      for (const genre of book.genres) {
        const current = genreCounts.get(genre.id);

        if (current) {
          current.count++;
          continue;
        }

        genreCounts.set(genre.id, {
          id: genre.id,
          name: genre.name,
          count: 1,
        });
      }
    }

    // Group reading completions by month
    for (const history of readingHistoryLastSixMonths) {
      const key = DateTime.fromJSDate(history.completedAt, {
        zone: 'utc',
      })
        .setZone(userTimeZone)
        .toFormat('yyyy-MM');

      const activity = monthlyActivity.find((item) => item.month === key);

      if (activity) {
        activity.count++;
      }
    }

    const favoriteGenres = Array.from(genreCounts.values())
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count;
        }

        return a.name.localeCompare(b.name);
      })
      .slice(0, 5);

    return {
      totalBooks,
      read,
      reading,
      unread,
      readThisMonth,
      readThisYear,
      monthlyActivity,
      favoriteGenres,
      currentlyReading,
    };
  }

  private resolveTimeZone(timeZone?: string) {
    if (!timeZone) {
      return 'UTC';
    }

    const date = DateTime.now().setZone(timeZone);

    return date.isValid ? timeZone : 'UTC';
  }
}
