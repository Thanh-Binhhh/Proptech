import { Region } from 'apps/posts/src/schemas/create-posts.schema'
import { PostStatus_Stage1 } from 'apps/posts/src/schemas/post-status'
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString
} from 'class-validator'

export class CreatePostDto {
    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    developer?: string

    @IsString()
    @IsOptional()
    location?: string

    @IsEnum(Region, { message: "Vùng miền này không tồn tại" })
    @IsOptional()
    region?: string

    @IsEnum(PostStatus_Stage1, { message: "Trạng thái bài đăng này không hợp lệ" })
    @IsOptional()
    status?: string

    @IsString()
    @IsNotEmpty()
    category!: string

    @IsString()
    @IsOptional()
    htmlSource?: string

    @IsString()
    @IsOptional()
    jsonSource?: string
}