import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { PostStatus_Stage1, PostStatusValues } from "./post-status";

export type PostDocument = HydratedDocument<Post>

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
    @Prop({ trim: true })
    title?: string

    @Prop({
        type: {
            url: { type: String },
            publicId: { type: String },
        },
    })
    cover_picture?: {
        url: string;
        publicId: string;
    };

    @Prop({ trim: true })
    developer?: string

    @Prop({ trim: true })
    location?: string

    @Prop({ enum: Region })
    region?: string

    @Prop({
        required: true,
        enum: PostStatusValues,
        default: PostStatus_Stage1.DRAFT
    })
    status!: string;

    @Prop({ required: true })
    authorId!: string

    @Prop({
        type: Types.ObjectId,
        ref: 'Category',
    })
    category?: string

    @Prop({})
    htmlSource?: string

    @Prop({})
    jsonSource?: string
}

export const PostSchema = SchemaFactory.createForClass(Post)