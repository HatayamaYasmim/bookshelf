import { Controller, Get, UseGuards } from '@nestjs/common';
import { GenreService } from './genre.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('genre')
export class GenreController {
    constructor(
        private readonly genreService: GenreService,
    ) {}

    @Get()
    findAll() {
        return this.genreService.findAll()
    }   
}


