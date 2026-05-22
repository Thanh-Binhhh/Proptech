import {
    IsString,
    IsNotEmpty,
} from 'class-validator';

export class SetupPasswordDto {
    @IsString()
    @IsNotEmpty()
    password!: string
}