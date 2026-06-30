import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { PostStatus_Stage1, PostStatusValues } from "../../properties-posts/schemas/post-status";

export type NewsDocument = HydratedDocument<News>

@Schema({
    collection: 'news',
    timestamps: true
})
export class News {
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

    @Prop({
        required: true,
        enum: PostStatusValues,
        default: PostStatus_Stage1.DRAFT
    })
    status!: string;

    @Prop({ required: true })
    authorId!: string

    @Prop({})
    htmlSource?: string

    @Prop({})
    jsonSource?: string
}

export const NewsSchema = SchemaFactory.createForClass(News)