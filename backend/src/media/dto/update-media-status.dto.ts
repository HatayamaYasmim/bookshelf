import { IsIn } from 'class-validator';

export class UpdateMediaStatusDto {
  @IsIn(['WATCHLIST', 'WATCHING', 'WATCHED'])
  status!: 'WATCHLIST' | 'WATCHING' | 'WATCHED';
}