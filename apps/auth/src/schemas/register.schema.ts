import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

export enum AccountStatus {
    PENDING_FIRST_LOGIN = 'Chờ xác thực',
    ACTIVE = 'Kích hoạt',
    DISABLED = 'Ngừng hoạt động',
}

export enum AccountRole {
    EMPLOYEE = 'Nhân viên',
    MANAGER = 'Quản lý',
    INTERN = 'Thực tập sinh'
}

@Schema({
    collection: 'accounts'
})
export class Account {
    @Prop({
        required: true,
        trim: true
    })
    name!: string

    @Prop({
        required: true,
        unique: true,
        trim: true
    })
    email!: string

    @Prop({ default: null })
    hashedPassword?: string

    @Prop({ default: AccountRole.EMPLOYEE })
    role!: string

    @Prop({
        enum: AccountStatus,
        default: AccountStatus.PENDING_FIRST_LOGIN,
    })
    status!: AccountStatus;
}

export const AccountSchema = SchemaFactory.createForClass(Account)