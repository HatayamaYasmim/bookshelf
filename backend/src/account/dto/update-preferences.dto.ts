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
     @IsIn([
        'indigo',
        'blue',
        'cyan',
        'teal',
        'green',
        'lime',
        'yellow',
        'orange',
        'red',
        'pink',
        'grape',
        'violet',
    ])
    primaryColor?: string;
}