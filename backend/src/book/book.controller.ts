import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';

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
}
