import {
    IsNotEmpty,
    IsEmail,
} from 'class-validator';

export class LogInDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsNotEmpty()
    password!: string
}