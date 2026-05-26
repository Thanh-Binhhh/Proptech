import { InjectModel } from "@nestjs/mongoose";
import { Message, MessageStatus } from "../schemas/contact.schema";
import { Model, Types } from "mongoose";

export class ContactDb {
    constructor(
        @InjectModel(Message.name)
        private readonly messageModel: Model<Message>
    ) { }

    create = async (request) => {
        return await this.messageModel.create(request)
    }

    update = async (_id: string, status) => {
        return await this.messageModel.findByIdAndUpdate(
            _id,
            { status },
            { new: true }
        );
    };

    findOne = async (_id) => {
        if (!Types.ObjectId.isValid(_id)) {
            return null;
        }
        return await this.messageModel.findById(_id)
    }

    find = async () => {
        return await this.messageModel
            .find()
            .lean()
    }
}