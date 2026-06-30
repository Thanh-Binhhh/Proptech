import { PostStatusValues } from 'apps/posts/src/properties-posts/schemas/post-status'
import {
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator'

export class UpdateStatusPostDto {
    @IsIn(PostStatusValues, { message: 'Trạng thái bài đăng này không tồn tại' })
    @IsNotEmpty()
    status!: string

    @IsString()
    @IsOptional()
    reason!: string
}