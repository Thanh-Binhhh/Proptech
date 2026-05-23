import { Prop } from '@nestjs/mongoose'
import { PostStatus } from 'apps/posts/src/schemas/posts.schema'
import {
    IsNotEmpty,
    IsOptional,
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

    @Prop({ default: PostStatus.DRAFT })
    @IsString()
    @IsOptional()
    status!: string

    @IsString()
    @IsNotEmpty()
    htmlSource!: string

    @IsString()
    @IsNotEmpty()
    jsonSource!: string
}