import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookStatusDto } from './dto/update-book-status.dto';
import { FindBooksQueryDto } from './dto/find-books-query.dto';
import { UpdateBookDto } from './dto/update-book-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
    user: {
        userId: number;
    };
}

@UseGuards(JwtAuthGuard)
@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }
    @Get('stats')
    getStats(@Req() request: AuthenticatedRequest ) {
        return this.bookService.getStats(
        request.user.userId,
        )
    }
    @Get()
    findAll(@Req() request: AuthenticatedRequest, @Query() query: FindBooksQueryDto) {
        return this.bookService.findAll(request.user.userId, query);
    }

    @Post()
    create(@Req() request: AuthenticatedRequest, @Body() data: CreateBookDto) {
        return this.bookService.create(request.user.userId, data)
    }

    @Patch(':id/status')
    updateStatus(
        @Req() request: AuthenticatedRequest, 
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateBookStatusDto,
    ) {
        return this.bookService.updateStatus(request.user.userId, id, data.status);
    }

    @Patch(':id')
    update(
        @Req() request: AuthenticatedRequest, 
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateBookDto
    ) {
        return this.bookService.update(request.user.userId, id, data)
    }

    @Delete(':id')
    remove(
        @Req() request: AuthenticatedRequest, 
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.bookService.remove(request.user.userId, id)
    }

    

}
