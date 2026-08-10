import mongoose from "mongoose";
import Topic from "../models/Topic.js";
import AppError from "../utils/AppError.js";
import { TOPIC_STATUS } from "../constants/topicStatus.js";

export const createTopic = async ({ name, code, description }) => {

    const existingTopic = await Topic.findOne({ code });

    if (existingTopic) {
        throw new AppError(
            "Topic with this code already exists",
            409
        );
    }

    const topic = await Topic.create({
        name,
        code,
        description
    });

    return topic;
};

export const getAllTopics = async () => {

    const topics = await Topic.find()
        .sort({ createdAt: -1 });

    return topics;
};

export const getTopicById = async (id) => {
    

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(
            "Invalid topic ID",
            400
        );
    }

    const topic = await Topic.findById(id);

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