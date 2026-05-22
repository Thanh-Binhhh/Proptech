import { InjectModel } from "@nestjs/mongoose";
import { Account } from "./schemas/register.schema";
import { Model } from "mongoose";
import { RefreshToken } from "./schemas/refresh-token.schema";

export class AuthDb {
    constructor(
        @InjectModel(Account.name)
        private readonly accountModel: Model<Account>,

        @InjectModel(RefreshToken.name)
        private readonly refreshTokenModel: Model<RefreshToken>
    ) { }

    create = async (request) => {
        return await this.accountModel.create(request)
    }

    find = async () => {
        return await this.accountModel
            .find()
            .select({
                _id: 1,
                name: 1,
                email: 1,
                role: 1,
                status: 1,
            })
            .lean()
    }

    findById = async (_id) => {
        return await this.accountModel.findOne({ _id })
    }

    findByEmail = async (email) => {
        return await this.accountModel.findOne({ email })
    }

    storeRefreshToken = async (refreshToken, accountId, expiryAt) => {
        return await this.refreshTokenModel.updateOne(
            { accountId },
            { $set: { refreshToken, expiryAt } },
            { upsert: true }
        )
    }

    findRefreshToken = async (request) => {
        return await this.refreshTokenModel.findOne({
            refreshToken: request
        })
    }
}