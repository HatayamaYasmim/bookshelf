import { IsString, IsNotEmpty, IsInt, Min, IsOptional, IsIn } from "class-validator";

export class CreateBookDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsInt()
    @Min(1)
    authorId!: number;

    @IsOptional()
    @IsIn(['UNREAD', 'READING', 'READ'])
    status?: 'UNREAD' | 'READING' | 'READ';
}