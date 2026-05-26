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
    name!: string

    @IsString()
    @IsNotEmpty()
    phone!: string

    @IsString()
    @IsNotEmpty()
    message!: string

    @Prop({ default: PostStatus.DRAFT })
    @IsString()
    @IsOptional()
    status!: string
}