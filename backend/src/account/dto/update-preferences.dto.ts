import {
    IsIn,
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdatePreferencesDto {
    @IsOptional()
    @IsIn(['SYSTEM', 'LIGHT', 'DARK'])
    theme?: 'SYSTEM' | 'LIGHT' | 'DARK';

    @IsOptional()
    @IsString()
    primaryColor?: string;
}