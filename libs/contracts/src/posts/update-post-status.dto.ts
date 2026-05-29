import { PostStatus_Stage2, PostStatus_Stage3 } from 'apps/posts/src/schemas/post-status'
import {
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator'

const UpdatePostStatusValues = [
    ...Object.values(PostStatus_Stage2),
    ...Object.values(PostStatus_Stage3),
];

export class UpdateStatusPostDto {
    @IsIn(UpdatePostStatusValues, { message: 'Trạng thái bài đăng này không tồn tại' })
    @IsNotEmpty()
    status!: string

    @IsString()
    @IsOptional()
    reason!: string
}