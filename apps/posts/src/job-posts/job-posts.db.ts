import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PostStatus_Stage2, PostStatusValues } from "../properties-posts/schemas/post-status";
import { Jobs } from "./schemas/jobs.schema";

export class JobsDb {
    constructor(
        @InjectModel(Jobs.name)
        private readonly jobsModel: Model<Jobs>,
    ) { }

    create = async (request) => {
        return await this.jobsModel.create(request)
    }

    update = async (_id, request) => {
        return await this.jobsModel.findByIdAndUpdate(
            _id,
            { $set: request },
            { new: true },
        )
    }

    updateStatus = async (_id, status) => {
        return await this.jobsModel.findByIdAndUpdate(
            _id,
            { $set: { status } },
            { new: true },
        )
    }

    findOne = async (_id, token = false) => {
        if (!Types.ObjectId.isValid(_id))
            return null;

        const queryOptions = token
            ? {
                filter: { _id },
                select: '',
            }
            : {
                filter: { _id, status: PostStatus_Stage2.PUBLISHED },
                select: '-authorId',
            };

        return await this.jobsModel
            .findOne(queryOptions.filter)
            .select(queryOptions.select)
    }

    find = async (skip, limit, token = false, status?) => {
        const queryOptions = token
            ? {
                filter: this.buildPrivateFilter(status),
                select: '-createdAt -htmlSource -jsonSource',
            }
            : {
                filter: this.buildPublicFilter(),
                select: '-authorId -createdAt -htmlSource -jsonSource',
            };

        let query = this.jobsModel
            .find(queryOptions.filter)
            .select(queryOptions.select)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })

        return await query.lean()
    }

    count = async (token = false, status?) => {
        const filter = token
            ? this.buildPrivateFilter(status)
            : this.buildPublicFilter()

        return await this.jobsModel.countDocuments(filter)
    }

    countAllStatus = async () => {
        const response = await this.jobsModel.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ])

        var statusCount = Object.fromEntries(
            Object.values(PostStatusValues).map(s => [s, 0])
        )

        response.forEach(s => {
            statusCount[s._id] = s.count
        })

        return statusCount
    }

    /*==========================
        HELPER FUNCTIONS
    ============================*/
    private buildPrivateFilter(status?: string) {
        return {
            ...(status ? { status } : {}),
        };
    }

    private buildPublicFilter() {
        return {
            status: PostStatus_Stage2.PUBLISHED
        };
    }
}