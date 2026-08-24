import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class CreateAuthorDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name!: string;
}