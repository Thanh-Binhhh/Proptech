import {
    IsNotEmpty,
    IsString
} from 'class-validator'

export class CreateContactDto {
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