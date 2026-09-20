import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { FindBooksQueryDto } from './dto/find-books-query.dto';
import { UpdateBookDto } from './dto/update-book-dto';

@Injectable()
export class BookService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(userId: number, query: FindBooksQueryDto,) {
        const {
            page,
            limit,
            search,
            status,
            authorId,
        } = query;

        const skip = (page - 1) * limit;

        const where = {
            userId,
            ...(search && {
                title: {
                    contains: search,
                    mode: 'insensitive' as const,
                }
            }),

            ...(status && {
                status,
            }),

            ...(authorId && {
                authorId,
            })
        }

        const [books, total] = await Promise.all([
            this.prisma.book.findMany({
                where,
                include: {
                    author: true,
                    genres: true
                },
                orderBy: {
                    title: 'asc'
                },
                skip,
                take: limit,
            }),
            this.prisma.book.count({
                where,
            })
        ])

        return {
            data: books,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    }

    async create(userId: number, data: CreateBookDto) {
        const author = await this.prisma.author.findUnique({
            where: {
                id: data.authorId,
            }
        });

        if (!author) {
            throw new NotFoundException(
                `Author with id ${data.authorId} not found`,
            );
        }

        if (data.genreIds?.length) {
            const genres = await this.prisma.genre.findMany({
                where: {
                    id: {
                        in: data.genreIds,
                    },
                },
                select: {
                    id: true,
                },
            });

            if (genres.length !== data.genreIds.length) {
                throw new NotFoundException(
                    'One or more genres were not found',
                );
            }
        }

        const isRead = data.status === 'READ';
        const completedAt = new Date();

        return this.prisma.book.create({
            data: {
                title: data.title,
                user: {
                    connect: { id: userId },
                },
                ...(data.status && {
                    status: data.status,
                }),
                author: {
                    connect: {
                        id: data.authorId,
                    },
                },
                ...(data.genreIds?.length && {
                    genres: {
                        connect: data.genreIds.map((id) => ({
                            id,
                        })),
                    },
                }),
                ...(isRead && {
                    readingHistory: {
                        create: {
                            completedAt,
                        },
                    },
                }),
            },

            include: {
                author: true,
                genres: true,
            },
        });
    }

    async updateStatus(
        userId: number,
        id: number,
        status: 'UNREAD' | 'READING' | 'READ',
    ) {
        const currentBook =
            await this.prisma.book.findUnique({
                where: { id, userId },
            });

        if (!currentBook) {
            throw new NotFoundException(
                'Book not found',
            );
        }

        const hasBeenCompleted = status === 'READ';

        const completedAt = new Date();

        return this.prisma.book.update({
            where: { id },

            data: {
                status,

                ...(hasBeenCompleted && {
                    readingHistory: {
                        create: {
                            completedAt,
                        },
                    },
                }),
            },

            include: {
                author: true,
                genres: true,
            },
        });
    }

    async getStats(userId: number) {
        const [
            total,
            read,
            reading,
            unread,
        ] = await Promise.all([
            this.prisma.book.count({ where: { userId },}),
            this.prisma.book.count({
                where: {
                    userId,
                    status: 'READ'
                }
            }),
            this.prisma.book.count({
                where: {
                    userId,
                    status: 'READING'
                }
            }),
            this.prisma.book.count({
                where: {
                    userId,
                    status: 'UNREAD'
                }
            })

        ]);
        return {
            total,
            read,
            reading,
            unread
        }
    }

    async update(
        userId: number,
        id: number,
        data: UpdateBookDto,
    ) {
        const currentBook = await this.prisma.book.findFirst({
                where: { id, userId },
            });

        if (!currentBook) {
            throw new NotFoundException(
                'Book not found',
            );
        }

        const author = await this.prisma.author.findUnique({
            where: {
                id: data.authorId
            }
        });

        if (!author) {
            throw new NotFoundException('Author not found');
        }

        if (data.genreIds?.length) {
            const genres =
                await this.prisma.genre.findMany({
                    where: {
                        id: {
                            in: data.genreIds,
                        },
                    },
                    select: {
                        id: true,
                    },
                });

            if (
                genres.length !==
                data.genreIds.length
            ) {
                throw new NotFoundException(
                    'One or more genres were not found',
                );
            }
        }

        const hasBeenCompleted = currentBook.status !== 'READ' && data.status === 'READ';
        const completedAt = new Date();

        return this.prisma.book.update({
            where: {
                id,
            },
            data: {
                title: data.title,
                authorId: data.authorId,
                status: data.status,
                ...(data.genreIds && {
                    genres: {
                        set: data.genreIds.map((id) => ({
                            id,
                        })),
                    },
                }),
                ...(hasBeenCompleted && {
                    readingHistory: {
                        create: {
                            completedAt,
                        },
                    },
                }),
            },
            include: {
                author: true,
                genres: true
            }
        })
    }

    async remove( userId: number, id: number) {
        const book = await this.prisma.book.findUnique({ where: { userId, id } })

        if (!book) {
            throw new NotFoundException('Book not found')
        }

        return this.prisma.book.delete({
            where: {
                id
            }
        })
    }
}
