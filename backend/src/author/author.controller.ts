import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
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
