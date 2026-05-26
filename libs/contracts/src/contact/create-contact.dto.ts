import {
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator'

export class CreateContactDto {
    @IsString()
    @IsOptional()
    propertyId!: string

    @IsString()
    @IsNotEmpty()
    name!: string

    @IsString()
    @IsNotEmpty()
    phone!: string

    @IsString()
    @IsNotEmpty()
    message!: string
}