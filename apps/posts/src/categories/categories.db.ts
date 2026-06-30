import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Category } from "./schemas/categories.schema";

export class CategoriesDb {
    constructor(
        @InjectModel(Category.name)
        private readonly categoryModel: Model<Category>
    ) { }

    create = async (request) => {
        return await this.categoryModel.create(request)
    }

    edit = async (_id, name) => {
        return await this.categoryModel.findByIdAndUpdate(
            _id,
            { $set: { name } },
            { new: true },
        )
    }

    findOne = async (_id) => {
        if (!Types.ObjectId.isValid(_id))
            return null;

        return await this.categoryModel.findById(_id)
    }

    find = async () => {
        return await this.categoryModel
            .find()
            .sort({ name: 1 })
            .lean()
    }
}