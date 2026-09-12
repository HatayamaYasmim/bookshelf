import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GenreService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async findAll() {
        return this.prisma.genre.findMany({
            orderBy: {
                name: 'asc'
            }
        })
    }
}
