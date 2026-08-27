import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookStatusDto } from './dto/update-book-status.dto';
import { FindBooksQueryDto } from './dto/find-books-query.dto';

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }
    @Get('stats')
    getStats() {
        return this.bookService.getStats()
    }
    @Get()
    findAll(@Query() query: FindBooksQueryDto,) {
        return this.bookService.findAll(query);
    }

    @Post()
    create(@Body() data: CreateBookDto) {
        return this.bookService.create(data)
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateBookStatusDto,
    ) {
        return this.bookService.updateStatus(id, data.status);
    }


}
