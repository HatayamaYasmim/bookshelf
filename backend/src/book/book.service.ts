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
                    author: true
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

        return this.prisma.book.create({
            data: {
                title: data.title,
                ...(data.status && {
                    status: data.status,
                }),
                readAt:
                    data.status === 'READ'
                        ? new Date()
                        : null,
                author: {
                    connect: {
                        id: data.authorId,
                    },
                },
            },
            include: {
                author: true,
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

        let readAt = currentBook.readAt;

        if (
            currentBook.status !== 'READ' &&
            status === 'READ'
        ) {
            readAt = new Date();
        }

        if (
            currentBook.status === 'READ' &&
            status !== 'READ'
        ) {
            readAt = null;
        }

        return this.prisma.book.update({
            where: { id },
            data: {
                status,
                readAt
            },
            include: {
                author: true,
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

        let readAt = currentBook.readAt;

        if (
            currentBook.status !== 'READ' &&
            data.status === 'READ'
        ) {
            readAt = new Date();
        }

        if (
            currentBook.status === 'READ' &&
            data.status !== 'READ'
        ) {
            readAt = null;
        }

        return this.prisma.book.update({
            where: {
                id,
            },
            data: {
                title: data.title,
                authorId: data.authorId,
                status: data.status,
                readAt,
            },
            include: {
                author: true
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
