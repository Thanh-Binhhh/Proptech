import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Post } from "./create-posts.schema";
import { Account } from "apps/auth/src/schemas/register.schema";
import { PostStatusValues } from "./post-status";

export type PostStatusHistoryDocument = HydratedDocument<PostStatusHistory>

@Schema({
    collection: 'status-history',
    timestamps: true
})
export class PostStatusHistory {
    @Prop({
        type: Types.ObjectId,
        ref: Post.name,
        required: true,
    })
    postId!: Types.ObjectId;

    @Prop({
        type: String,
        enum: PostStatusValues,
        required: true
    })
    status!: string;

    @Prop({
        trim: true,
    })
    reason?: string;

    @Prop({
        type: Types.ObjectId,
        ref: Account.name,
    })
    actionBy?: Types.ObjectId;

    @Prop({})
    publication_date?: Date
}

export const PostStatusHistorySchema = SchemaFactory.createForClass(PostStatusHistory)