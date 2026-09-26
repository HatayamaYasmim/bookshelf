import { IsIn, IsInt, IsPositive } from 'class-validator';

export class CreateUserMediaDto {
  @IsInt()
  @IsPositive()
  tmdbId!: number;

  @IsIn(['MOVIE', 'TV'])
  type!: 'MOVIE' | 'TV';
}
