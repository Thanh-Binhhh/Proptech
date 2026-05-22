import { Prop } from '@nestjs/mongoose';
import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsOptional,
} from 'class-validator';

export enum AccountRole {
    EMPLOYEE = 'Nhân viên',
    MANAGER = 'Quản lý'
}

export class RegistrationDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @Prop({ default: AccountRole.EMPLOYEE })
    @IsOptional()
    @IsString()
    role!: string;
}