import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PostDocument = HydratedDocument<Post>

export enum PostStatus {
    DRAFT = 'Bản nháp',
    PENDING_APPROVAL = 'Chờ duyệt',
    PRIVATE = 'Riêng tư',
    PUBLISHED = 'Xuất bản',
}

export enum Region {
    NORTH = 'Miền Bắc',
    CENTRAL = 'Miền Trung',
    SOUTH = 'Miền Nam',
}

@Schema({
    collection: 'posts',
    timestamps: true
})
export class Post {
    @Prop({
        required: true,
        trim: true
    })
    title!: string

    @Prop({
        type: {
            url: { type: String, required: true },
            publicId: { type: String, required: true },
        },
        required: true,
    })
    cover_picture!: {
        url: string;
        publicId: string;
    };

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
        default: Region.NORTH
    })
    region!: string

    @Prop({
        enum: PostStatus,
        default: PostStatus.DRAFT,
    })
    status!: PostStatus;

    @Prop({})
    publication_date!: Date;

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