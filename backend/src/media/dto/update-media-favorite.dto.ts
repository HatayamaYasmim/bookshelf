import { IsBoolean } from 'class-validator';

export class UpdateMediaFavoriteDto {
  @IsBoolean()
  favorite!: boolean;
}