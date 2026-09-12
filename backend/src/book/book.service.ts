import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { FindBooksQueryDto } from './dto/find-books-query.dto';
import { UpdateBookDto } from './dto/update-book-dto';

@Injectable()
export class BookService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(query: FindBooksQueryDto) {
        const {
            page,
            limit,
            search,
            status,
            authorId,
        } = query;

        const skip = (page - 1) * limit;

        const where = {
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

    async create(data: CreateBookDto) {
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
        id: number,
        status: 'UNREAD' | 'READING' | 'READ',
    ) {
        const currentBook =
            await this.prisma.book.findUnique({
                where: { id },
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

    async getStats() {
        const [
            total,
            read,
            reading,
            unread,
        ] = await Promise.all([
            this.prisma.book.count(),
            this.prisma.book.count({
                where: {
                    status: 'READ'
                }
            }),
            this.prisma.book.count({
                where: {
                    status: 'READING'
                }
            }),
            this.prisma.book.count({
                where: {
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
        id: number,
        data: UpdateBookDto,
    ) {
        const currentBook =
            await this.prisma.book.findUnique({
                where: { id },
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

    async remove(id: number) {
        const book = await this.prisma.book.findUnique({ where: { id } })

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
