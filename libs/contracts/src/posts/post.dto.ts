import { Region } from 'apps/posts/src/schemas/posts.schema'
import {
    IsEnum,
    IsNotEmpty,
    IsString
} from 'class-validator'

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    title!: string

    @IsString()
    @IsNotEmpty()
    developer!: string

    @IsString()
    @IsNotEmpty()
    location!: string

    @IsEnum(Region, { message: "Vùng miền không hợp hệ" })
    @IsNotEmpty()
    region!: string

    @IsString()
    @IsNotEmpty()
    categoryId!: string

    @IsString()
    @IsNotEmpty()
    htmlSource!: string

    @IsString()
    @IsNotEmpty()
    jsonSource!: string
}