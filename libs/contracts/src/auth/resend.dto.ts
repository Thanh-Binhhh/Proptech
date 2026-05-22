import {
    IsString,
    IsNotEmpty,
} from 'class-validator';

export class ResendDto {
    @IsString()
    @IsNotEmpty()
    _id!: string
}