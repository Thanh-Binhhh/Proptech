import { PostStatusValues } from 'apps/posts/src/properties-posts/schemas/post-status'
import {
    IsEnum,
    IsOptional,
    IsString
} from 'class-validator'

export class UpdateNewsDto {
    @IsString()
    @IsOptional()
    title?: string

    @IsEnum(PostStatusValues, { message: "Trạng thái bài đăng này không tồn tại" })
    @IsOptional()
    status?: string

    @IsString()
    @IsOptional()
    htmlSource?: string

    @IsString()
    @IsOptional()
    jsonSource?: string
}