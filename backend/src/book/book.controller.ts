import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookStatusDto } from './dto/update-book-status.dto';

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Get()
    findAll() {
        return this.bookService.findAll();
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
