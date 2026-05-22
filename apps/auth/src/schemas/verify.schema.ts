import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { HydratedDocument, Types } from 'mongoose';

export type VerificationDocument = HydratedDocument<Verification>;

@Schema({
    collection: 'verifications'
})
export class Verification {
    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'Account',
    })
    accountId!: Types.ObjectId;

    @Prop({ required: true, unique: true })
    token!: string;

    @Prop({ required: true })
    expiredAt!: Date

    @Prop({ default: false })
    used!: boolean;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification)