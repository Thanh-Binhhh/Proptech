import { InjectModel } from "@nestjs/mongoose";
import { Message } from "../schemas/contact.schema";
import { Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ContactDb {
    constructor(
        @InjectModel(Message.name)
        private readonly messageModel: Model<Message>
    ) { }

    create = async (request) => {
        return await this.messageModel.create(request)
    }

    update = async (_id: string, status, resolvedBy) => {
        return await this.messageModel.findByIdAndUpdate(
            _id,
            { status, resolvedBy },
            { returnDocument: 'after' }
        );
    };

    findOne = async (_id) => {
        if (!Types.ObjectId.isValid(_id)) {
            return null;
        }
        return await this.messageModel.findById(_id).lean()
    }

    findByEmployee = async (employeeId) => {
        if (!Types.ObjectId.isValid(employeeId)) {
            return null;
        }
        return await this.messageModel.find({ employeeId })
    }

    find = async (skip, limit) => {
        return await this.messageModel
            .find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean()
    }

    count = async () => {
        return await this.messageModel.countDocuments()
    }
}