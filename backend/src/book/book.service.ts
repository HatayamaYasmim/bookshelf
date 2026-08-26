import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { FindBooksQueryDto } from './dto/find-books-query.dto';

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
        
        const skip = (page - 1 ) * limit;

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
                totalPages: Math.ceil(total/limit)
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
        return this.prisma.book.update({
            where: { id },
            data: {
                status,
            },
            include: {
                author: true,
            },
        });
    }
}
