import { PostStatus_Stage1 } from 'apps/posts/src/properties-posts/schemas/post-status'
import {
    IsEnum,
    IsOptional,
    IsString
} from 'class-validator'

export class CreateNewsDto {
    @IsString()
    @IsOptional()
    title?: string

    @IsEnum(PostStatus_Stage1, { message: "Trạng thái tin tức này không hợp lệ" })
    @IsOptional()
    status?: string

    @IsString()
    @IsOptional()
    htmlSource?: string

    @IsString()
    @IsOptional()
    jsonSource?: string
}