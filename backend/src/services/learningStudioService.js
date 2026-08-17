import mongoose from "mongoose";

import Topic from "../models/Topic.js";
import LearningContent from "../models/LearningContent.js";
import LearningActivity from "../models/LearningActivity.js";

import AppError from "../utils/AppError.js";


export const getLearningStudioTopic = async (topicId) => {

    /*
     * Validate Topic ID
     */

    if (!mongoose.Types.ObjectId.isValid(topicId)) {

        throw new AppError(
            "Invalid topic ID",
            400
        );

    }


    /*
     * Fetch Topic
     */

    const topic = await Topic.findById(topicId)
        .populate({
            path: "module",
            select: "name code sequence course",
            populate: {
                path: "course",
                select: "name code status"
            }
        });

    if (!topic) {

        throw new AppError(
            "Topic not found",
            404
        );

    }


    /*
     * Fetch Learning Content
     */

    const content = await LearningContent.find({
        topic: topicId,
        // status: "ACTIVE"
    })
    .sort({
        sequence: 1
    });


    /*
     * Fetch Learning Activities
     *
     * Populate the reusable Question
     */

    const activities = await LearningActivity.find({
        topic: topicId,
        // status: "ACTIVE"
    })
    .populate(
        "question",
        "code title description questionType difficulty options explanation constraints inputFormat outputFormat allowedLanguages executionTimeLimit memoryLimit"
    )
    .sort({
        sequence: 1
    });


    /*
     * Return complete Learning Studio
     * structure for the Topic
     */

    return {
        topic,
        content,
        activities
    };
};