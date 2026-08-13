import mongoose from "mongoose";

import LearningActivity
    from "../models/LearningActivity.js";

import Topic
    from "../models/Topic.js";

import Question
    from "../models/Question.js";

import AppError
    from "../utils/AppError.js";

import { TOPIC_STATUS }
    from "../constants/topicStatus.js";

import { QUESTION_STATUS }
    from "../constants/questionStatus.js";


export const createLearningActivity = async ({
    topic,
    question,
    completionWeight,
    sequence
}) => {

    /*
     * Validate Topic ID
     */

    if (!mongoose.Types.ObjectId.isValid(topic)) {

        throw new AppError(
            "Invalid topic ID",
            400
        );

    }


    /*
     * Validate Question ID
     */

    if (!mongoose.Types.ObjectId.isValid(question)) {

        throw new AppError(
            "Invalid question ID",
            400
        );

    }


    /*
     * Validate Completion Weight
     */

    if (
        completionWeight === undefined ||
        completionWeight === null
    ) {

        throw new AppError(
            "Completion weight is required",
            400
        );

    }

    if (
        typeof completionWeight !== "number" ||
        Number.isNaN(completionWeight)
    ) {

        throw new AppError(
            "Completion weight must be a number",
            400
        );

    }

    if (
        completionWeight <= 0 ||
        completionWeight > 100
    ) {

        throw new AppError(
            "Completion weight must be greater than 0 and at most 100",
            400
        );

    }


    /*
     * Validate Sequence
     */

    if (
        sequence === undefined ||
        sequence === null
    ) {

        throw new AppError(
            "Learning activity sequence is required",
            400
        );

    }

    if (
        !Number.isInteger(sequence) ||
        sequence < 1
    ) {

        throw new AppError(
            "Learning activity sequence must be a positive integer",
            400
        );

    }


    /*
     * Find Topic
     */

    const existingTopic =
        await Topic.findById(topic);

    if (!existingTopic) {

        throw new AppError(
            "Topic not found",
            404
        );

    }


    /*
     * Topic must be active
     */

    if (
        existingTopic.status !== TOPIC_STATUS.ACTIVE
    ) {

        throw new AppError(
            "Cannot create learning activity under an inactive topic",
            400
        );

    }


    /*
     * Find Question
     */

    const existingQuestion =
        await Question.findById(question);

    if (!existingQuestion) {

        throw new AppError(
            "Question not found",
            404
        );

    }


    /*
     * Question must be active
     */

    if (
        existingQuestion.status !== QUESTION_STATUS.ACTIVE
    ) {

        throw new AppError(
            "Cannot create learning activity using an inactive question",
            400
        );

    }


    /*
     * Question must belong to
     * the same Topic.
     *
     * This is a critical curriculum
     * integrity rule.
     */

    if (
        existingQuestion.topic.toString() !==
        existingTopic._id.toString()
    ) {

        throw new AppError(
            "Question does not belong to the specified topic",
            400
        );

    }


    /*
     * Prevent duplicate Question
     * within the same Learning Topic.
     */

    const existingActivity =
        await LearningActivity.findOne({
            topic,
            question
        });

    if (existingActivity) {

        throw new AppError(
            "Question is already added as a learning activity for this topic",
            409
        );

    }


    /*
     * Prevent duplicate sequence
     * within the same Learning Topic.
     */

    const existingSequence =
        await LearningActivity.findOne({
            topic,
            sequence
        });

    if (existingSequence) {

        throw new AppError(
            "Learning activity with this sequence already exists in this topic",
            409
        );

    }


    /*
     * Create Learning Activity
     */

    const learningActivity =
        await LearningActivity.create({

            topic,
            question,
            completionWeight,
            sequence

        });


    return learningActivity;
};

export const getLearningActivitiesByTopic = async (topicId) => {

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
     * Find Topic
     */

    const existingTopic =
        await Topic.findById(topicId);

    if (!existingTopic) {

        throw new AppError(
            "Topic not found",
            404
        );

    }


    /*
     * Fetch Learning Activities
     *
     * Question is populated because the
     * Learning Studio needs the question
     * content along with its activity
     * configuration.
     */

    const learningActivities =
        await LearningActivity.find({
            topic: topicId,
            status: "ACTIVE"
        })
        .populate(
            "question",
            "code title description questionType difficulty options explanation constraints inputFormat outputFormat allowedLanguages executionTimeLimit memoryLimit"
        )
        .sort({
            sequence: 1
        });


    return learningActivities;
};