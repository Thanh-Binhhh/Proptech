import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type MessageDocument = HydratedDocument<Message>

export enum MessageStatus {
    NEW = 'Mới',
    IN_PROGRESS = 'Đang xử lý',
    RESOLVED = 'Đã xử lý',
    SPAM = 'Tin rác',
}

@Schema({
    collection: 'messages',
    timestamps: true
})
export class Message {
    @Prop({
        required: true,
        trim: true
    })
    name!: string

    @Prop({
        required: true,
        trim: true
    })
    phone!: string

    @Prop({
        required: true,
        trim: true
    })
    message!: string

    @Prop({
        enum: MessageStatus,
        default: MessageStatus.NEW,
    })
    status!: MessageStatus;

    @Prop({})
    propertyId!: string

    @Prop({})
    employeeId!: string
}

export const MessageSchema = SchemaFactory.createForClass(Message)