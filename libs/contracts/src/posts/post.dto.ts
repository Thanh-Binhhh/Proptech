import { Prop } from '@nestjs/mongoose'
import { PostStatus, Region } from 'apps/posts/src/schemas/posts.schema'
import {
    IsEnum,
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

    @IsEnum(Region, { message: "Vùng miền không hợp hệ" })
    @IsNotEmpty()
    region!: string

    @IsEnum(PostStatus, { message: "Trạng thái bài đăng không hợp lệ." })
    @Prop({ default: PostStatus.DRAFT })
    @IsOptional()
    status!: string

    @IsString()
    @IsNotEmpty()
    htmlSource!: string

    @IsString()
    @IsNotEmpty()
    jsonSource!: string
}