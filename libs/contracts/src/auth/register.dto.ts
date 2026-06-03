import { Prop } from '@nestjs/mongoose';
import { AccountRole } from 'apps/auth/src/schemas/register.schema';
import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsOptional,
    IsEnum,
} from 'class-validator';

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