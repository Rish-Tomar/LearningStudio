import mongoose from "mongoose";
import Question from "../models/Question.js";
import Topic from "../models/Topic.js";
import AppError from "../utils/AppError.js";
import { TOPIC_STATUS } from "../constants/topicStatus.js";
import { QUESTION_STATUS } from "../constants/questionStatus.js";
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

export const getAllQuestions = async () => {

    const questions = await Question.find()
        .populate("topic", "name code") //this will bring info of topic here
        .sort({ createdAt: -1 });

    return questions;
};

export const getQuestionsByTopic = async (topicId) => {

    if (!mongoose.Types.ObjectId.isValid(topicId)) {
        throw new AppError(
            "Invalid topic ID",
            400
        );
    }

    const existingTopic = await Topic.findById(topicId);

    if (!existingTopic) {
        throw new AppError(
            "Topic not found",
            404
        );
    }

    const questions = await Question.find({
        topic: topicId
    })
        .populate(
            "topic",
            "name code sequence"
        )
        .sort({
            createdAt: -1
        });

    return questions;
};

export const getQuestionById = async (id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(
            "Invalid question ID",
            400
        );
    }

    const question = await Question.findById(id)
        .populate("topic", "name code"); //will retrieve topic information

    if (!question) {
        throw new AppError(
            "Question not found",
            404
        );
    }

    return question;
};


export const updateQuestionStatus = async (id, status) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(
            "Invalid question ID",
            400
        );
    }

    const question = await Question.findById(id);

    if (!question) {
        throw new AppError(
            "Question not found",
            404
        );
    }

    if (!Object.values(QUESTION_STATUS).includes(status)) {
        throw new AppError(
            "Invalid question status",
            400
        );
    }

    question.status = status;

    await question.save();

    return question;
};