import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateUserMediaDto {
  @IsInt()
  @IsPositive()
  tmdbId!: number;

  @IsIn(['MOVIE', 'TV'])
  type!: 'MOVIE' | 'TV';

  @IsOptional()
  @IsIn(['WATCHLIST', 'WATCHING', 'WATCHED'])
  status?: 'WATCHLIST' | 'WATCHING' | 'WATCHED' | null;

  @IsOptional()
  @IsBoolean()
  favorite?: boolean;
}