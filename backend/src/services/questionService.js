import mongoose from "mongoose";
import Question from "../models/Question.js";
import Topic from "../models/Topic.js";
import AppError from "../utils/AppError.js";
import { TOPIC_STATUS } from "../constants/topicStatus.js";

export const createQuestion = async (questionData) => {

    const {
        code,
        topic
    } = questionData;

    const existingQuestion = await Question.findOne({ code });

    if (existingQuestion) {
        throw new AppError(
            "Question with this code already exists",
            409
        );
    }

    if (!mongoose.Types.ObjectId.isValid(topic)) {
        throw new AppError(
            "Invalid topic ID",
            400
        );
    }

    const existingTopic = await Topic.findById(topic);

    if (!existingTopic) {
        throw new AppError(
            "Topic not found",
            404
        );
    }

    if (existingTopic.status !== TOPIC_STATUS.ACTIVE){
        throw new AppError(
            "Cannot create question under an inactive topic",
            400
        );
    }

    const question = await Question.create(questionData);

    return question;
};