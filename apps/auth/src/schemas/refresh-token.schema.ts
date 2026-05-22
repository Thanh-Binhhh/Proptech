import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({
    collection: 'refresh-token'
})
export class RefreshToken {
    @Prop({ required: true, })
    refreshToken!: string

    @Prop({
        required: true,
        type: mongoose.Types.ObjectId,
    })
    accountId!: mongoose.Types.ObjectId

    @Prop({ required: true })
    role?: string

    @Prop({ required: true })
    expiryAt?: Date
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)