import {
    IsNotEmpty,
    IsString
} from 'class-validator'

export class CreatePostDto {
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