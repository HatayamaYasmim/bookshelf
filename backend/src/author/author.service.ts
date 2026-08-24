import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';

@Injectable()
export class AuthorService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.author.findMany();
    }

    create(data: CreateAuthorDto) {
        return this.prisma.author.create({data,})
    }
}
