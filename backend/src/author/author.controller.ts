import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';

@Controller('authors')
export class AuthorController {
    constructor(private readonly authorService: AuthorService) {}

    @Get()
    findAll() {
        return this.authorService.findAll();
    }

    @Post()
    create(@Body() data:CreateAuthorDto) {
        return this.authorService.create(data);
    }
}
