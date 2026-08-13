import mongoose from "mongoose";
import Topic from "../models/Topic.js";
import AppError from "../utils/AppError.js";
import { TOPIC_STATUS } from "../constants/topicStatus.js";
import Module from "../models/Module.js";
import { MODULE_STATUS } from "../constants/moduleStatus.js";
import { COURSE_STATUS } from "../constants/courseStatus.js";

export const createTopic = async ({module, name, code, description, sequence}) => {

        const existingTopic = await Topic.findOne({ code });
        if (existingTopic) {
            throw new AppError(
                "Topic with this code already exists",
                409
            );
        }

        // -----------------------------------------
        // Legacy topic creation
        // -----------------------------------------
        // Temporarily allowed during curriculum migration.
        // New curriculum-aware topics should provide
        // module and sequence.
        if (!module) {
            if (sequence !== undefined) {
                throw new AppError(
                    "Module is required when sequence is provided",
                    400
                );
            }
            const topic = await Topic.create({
                name,
                code,
                description
            });
            return topic;
        }

        // -----------------------------------------
        // Curriculum-aware topic creation
        // -----------------------------------------

        if (!mongoose.Types.ObjectId.isValid(module)) {
            throw new AppError(
                "Invalid module ID",
                400
            );
        }

        const existingModule = await Module.findById(module).populate("course", "name code status");

        if (!existingModule) {
            throw new AppError("Module not found",404 );
        }

        if (existingModule.status !== MODULE_STATUS.ACTIVE) {
            throw new AppError(
                "Cannot create topic under an inactive module",
                400
            );
        }

        if (
            !existingModule.course ||
            existingModule.course.status !== COURSE_STATUS.ACTIVE
        ) {
            throw new AppError(
                "Cannot create topic under an inactive course",
                400
            );
        }

        if (sequence === undefined || sequence === null) {
            throw new AppError(
                "Topic sequence is required",
                400
            );
        }

        const existingTopicBySequence = await Topic.findOne({
            module,
            sequence
        });

        if (existingTopicBySequence) {
            throw new AppError(
                "Topic with this sequence already exists in this module",
                409
            );
        }

        const topic = await Topic.create({
            module,
            name,
            code,
            description,
            sequence
        });

        return topic;
};

export const getAllTopics = async () => {

    const topics = await Topic.find()
        .populate({
            path: "module",
            select: "name code sequence course",
            populate: {
                path: "course",
                select: "name code status"
            }
        })
        .sort({ createdAt: -1 });

    return topics;
};

export const getTopicsByModule = async (moduleId) => {

    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
        throw new AppError(
            "Invalid module ID",
            400
        );
    }

    const existingModule = await Module.findById(moduleId);

    if (!existingModule) {
        throw new AppError(
            "Module not found",
            404
        );
    }

    const topics = await Topic.find({
        module: moduleId
    })
        .populate({
            path: "module",
            select: "name code sequence course",
            populate: {
                path: "course",
                select: "name code status"
            }
        })
        .sort({
            sequence: 1,
            createdAt: 1
        });

    return topics;
};

export const getTopicById = async (id) => {
    

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(
            "Invalid topic ID",
            400
        );
    }

    const topic = await Topic.findById(id)
    .populate({
        path: "module",
        select: "name code sequence course",
        populate: {
            path: "course",
            select: "name code status"
        }
    });

    if(!topic){
        throw new AppError(
            "Topic not Found",
            404
        );
    }
    return topic;
}

export const updateTopicStatus = async (id, status) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(
            "Invalid topic ID",
            400
        );
    }

    if (!Object.values(TOPIC_STATUS).includes(status)) {
        throw new AppError(
            "Invalid topic status",
            400
        );
    }

    const topic = await Topic.findById(id);

    if (!topic) {
        throw new AppError(
            "Topic not Found",
            404
        );
    }

    topic.status = status;

    await topic.save();

    return topic;
};