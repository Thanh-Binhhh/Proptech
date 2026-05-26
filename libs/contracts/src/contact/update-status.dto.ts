import { MessageStatus } from 'apps/contact/schemas/contact.schema'
import {
    IsEnum,
    IsNotEmpty,
} from 'class-validator'

export class UpdateStatusDto {
    @IsEnum(MessageStatus, { message: "Trạng thái của yêu cầu liên hệ không hợp lệ" })
    @IsNotEmpty()
    status!: string
}