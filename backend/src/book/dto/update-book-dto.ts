import { IsString, IsNotEmpty, MaxLength, IsInt, Min, IsIn } from "class-validator";

export class UpdateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsInt()
  @Min(1)
  authorId!: number;

  @IsIn(['UNREAD', 'READING', 'READ'])
  status!: 'UNREAD' | 'READING' | 'READ';
}