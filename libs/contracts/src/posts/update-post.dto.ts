import { Region } from 'apps/posts/src/schemas/create-posts.schema'
import { PostStatus_Stage1, PostStatusValues } from 'apps/posts/src/schemas/post-status'
import {
    IsEnum,
    IsOptional,
    IsNotEmpty,
    IsString
} from 'class-validator'

export class UpdatePostDto {
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

    @IsEnum(PostStatusValues, { message: "Trạng thái bài đăng này không tồn tại" })
    @IsOptional()
    status?: string

    @IsString()
    @IsNotEmpty()
    category?: string

    @IsString()
    @IsOptional()
    htmlSource?: string

    @IsString()
    @IsOptional()
    jsonSource?: string
}