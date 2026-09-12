import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async getReadingDashboard() {
        const now = new Date();

        const startOfMonth = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                1,
            ),
        );

        const startOfYear = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                0,
                1,
            ),
        );

        const startOfSixMonths = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth() - 5,
                1,
            ),
        );

        const [
            totalBooks,
            read,
            reading,
            unread,
            readThisMonth,
            readThisYear,
            readingHistoryLastSixMonths,
            readBooksWithGenres,
            currentlyReading
        ] = await Promise.all([
            this.prisma.book.count(),

            this.prisma.book.count({
                where: {
                    status: 'READ',
                },
            }),

            this.prisma.book.count({
                where: {
                    status: 'READING',
                },
            }),

            this.prisma.book.count({
                where: {
                    status: 'UNREAD',
                },
            }),

            // Reading completions during the current month
            this.prisma.readingHistory.count({
                where: {
                    completedAt: {
                        gte: startOfMonth,
                    },
                },
            }),

            // Reading completions during the current year
            this.prisma.readingHistory.count({
                where: {
                    completedAt: {
                        gte: startOfYear,
                    },
                },
            }),

            // Reading completions during the last six months
            this.prisma.readingHistory.findMany({
                where: {
                    completedAt: {
                        gte: startOfSixMonths,
                    },
                },
                select: {
                    completedAt: true,
                },
            }),

            // Genres from currently completed books
            this.prisma.book.findMany({
                where: {
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

        const monthlyActivity = Array.from(
            { length: 6 },
            (_, index) => {
                const date = new Date(
                    Date.UTC(
                        now.getUTCFullYear(),
                        now.getUTCMonth() - (5 - index),
                        1,
                    ),
                );

                const year = date.getUTCFullYear();

                const month = String(
                    date.getUTCMonth() + 1,
                ).padStart(2, '0');

                return {
                    month: `${year}-${month}`,
                    count: 0,
                };
            },
        );

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
                const current = genreCounts.get(
                    genre.id,
                );

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
        for (
            const history of
            readingHistoryLastSixMonths
        ) {
            const year =
                history.completedAt.getUTCFullYear();

            const month = String(
                history.completedAt.getUTCMonth() + 1,
            ).padStart(2, '0');

            const key = `${year}-${month}`;

            const activity = monthlyActivity.find(
                (item) => item.month === key,
            );

            if (activity) {
                activity.count++;
            }
        }

        const favoriteGenres = Array.from(
            genreCounts.values(),
        )
            .sort((a, b) => {
                if (b.count !== a.count) {
                    return b.count - a.count;
                }

                return a.name.localeCompare(
                    b.name,
                );
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
}