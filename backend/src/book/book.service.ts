import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookService {
    constructor(private readonly prisma: PrismaService) { }

    findAll() {
        return this.prisma.book.findMany({
            include: {
                author: true,
            }
        });
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
