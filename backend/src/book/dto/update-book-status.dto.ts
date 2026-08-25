import { IsIn } from "class-validator";

export class UpdateBookStatusDto{
    @IsIn(['UNREAD', 'READING', 'READ'])
    status!: 'UNREAD' | 'READING' | 'READ';
}