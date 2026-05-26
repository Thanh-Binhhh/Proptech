import { Prop } from '@nestjs/mongoose';
import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsOptional,
    IsEnum,
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

    @IsEnum(AccountRole, { message: "Vai trò không hợp lệ." })
    @Prop({ default: AccountRole.EMPLOYEE })
    @IsOptional()
    role!: string;
}