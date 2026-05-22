import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PostDocument = HydratedDocument<Post>

export enum PostStatus {
    DRAFT = 'Bản nháp',
    PENDING_APPROVAL = 'Chờ duyệt',
    PUBLIC = 'Công khai',
    PRIVATE = 'Riêng tư',
}

export enum Region {
    NORTH = 'Miền Bắc',
    CENTRAL = 'Miền Trung',
    SOUTH = 'Miền Nam',
}

@Schema({
    collection: 'posts'
})
export class Post {
    @Prop({
        required: true,
        trim: true
    })
    name!: string

    @Prop({
        required: true,
        trim: true
    })
    developer!: string

    @Prop({
        required: true,
        trim: true
    })
    location!: string

    @Prop({
        required: true,
    })
    region!: string

    @Prop({
        enum: PostStatus,
        default: PostStatus.DRAFT,
    })
    status!: PostStatus;

    @Prop({
        required: true,
    })
    htmlSource!: string

    @Prop({
        required: true,
    })
    jsonSource!: string
}

export const PostSchema = SchemaFactory.createForClass(Post)