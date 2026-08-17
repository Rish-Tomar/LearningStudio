import mongoose from "mongoose";

import LearningContent  from "../models/LearningContent.js";

import Topic from "../models/Topic.js";

import AppError from "../utils/AppError.js";

import { TOPIC_STATUS }from "../constants/topicStatus.js";
import { LEARNING_CONTENT_STATUS } from "../constants/learningContentStatus.js";

export const createLearningContent = async ({
    topic,
    title,
    content,
    sequence,
    completionWeight
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
            "Learning content sequence is required",
            400
        );

    }

    if (
        !Number.isInteger(sequence) ||
        sequence < 1
    ) {

        throw new AppError(
            "Learning content sequence must be a positive integer",
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
            "Cannot create learning content under an inactive topic",
            400
        );

    }


    /*
     * Prevent duplicate sequence
     */

    const existingSequence =
        await LearningContent.findOne({
            topic,
            sequence
        });

    if (existingSequence) {

        throw new AppError(
            "Learning content with this sequence already exists in this topic",
            409
        );

    }

        /*
        * Validate total completion weight
        */

        const currentTotal =
            await getActiveCompletionWeightTotal(
                topic
            );


        if (
            currentTotal + completionWeight > 100
        ) {

            throw new AppError(
                `Completion weight exceeds the maximum allowed total of 100%. Current active total: ${currentTotal}%.`,
                400
            );

        }

    /*
     * Create Learning Content
     */

    const learningContent =
        await LearningContent.create({

            topic,
            title,
            content,
            sequence,
            completionWeight

        });
    
    


    return learningContent;
};

export const getLearningContentByTopic = async (topicId) => {

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
     * Fetch Active Learning Content
     *
     * Content is returned in the sequence
     * defined by the faculty.
     */

    const learningContent =
        await LearningContent.find({
            topic: topicId,
            status: "ACTIVE"
        })
        .sort({
            sequence: 1
        });


    return learningContent;
};

export const updateLearningContent = async (
    id,
    {
        title,
        content,
        sequence,
        completionWeight
    }
) => {

    /*
     * Validate Learning Content ID
     */

    if (!mongoose.Types.ObjectId.isValid(id)) {

        throw new AppError(
            "Invalid learning content ID",
            400
        );

    }


    /*
     * Find Learning Content
     */

    const learningContent =
        await LearningContent.findById(id);

    if (!learningContent) {

        throw new AppError(
            "Learning content not found",
            404
        );

    }


    /*
     * Validate Title
     */

    if (
        !title ||
        !title.trim()
    ) {

        throw new AppError(
            "Learning content title is required",
            400
        );

    }


    /*
     * Validate Content
     */

    if (
        !content ||
        !content.trim()
    ) {

        throw new AppError(
            "Learning content is required",
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
            "Learning content sequence is required",
            400
        );

    }

    if (
        !Number.isInteger(sequence) ||
        sequence < 1
    ) {

        throw new AppError(
            "Learning content sequence must be a positive integer",
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
     * Prevent duplicate sequence
     *
     * Ignore the current document itself.
     */

    const existingSequence =
        await LearningContent.findOne({
            topic: learningContent.topic,
            sequence,
            _id: {
                $ne: id
            }
        });

    if (existingSequence) {

        throw new AppError(
            "Learning content with this sequence already exists in this topic",
            409
        );

    }

    /*
    * Validate total completion weight
    *
    * Exclude the current content's existing
    * weight because it is being replaced.
    */

    const currentTotal =
        await getActiveCompletionWeightTotal(
            learningContent.topic
        );


    const adjustedTotal =
        currentTotal -
        learningContent.completionWeight +
        completionWeight;


    if (
        learningContent.status === "ACTIVE" &&
        adjustedTotal > 100
    ) {

        throw new AppError(
            `Completion weight exceeds the maximum allowed total of 100%. Current adjusted total: ${adjustedTotal}%.`,
            400
        );

    }

    /*
     * Update Learning Content
     */

    learningContent.title =
        title.trim();

    learningContent.content =
        content.trim();

    learningContent.sequence =
        sequence;

    learningContent.completionWeight =
        completionWeight;


    await learningContent.save();


    return learningContent;
};

export const updateLearningContentStatus = async (
    id,
    status
) => {

    /*
     * Validate Status
     */

    if (
        !Object.values(
            LEARNING_CONTENT_STATUS
        ).includes(status)
    ) {

        throw new AppError(
            "Invalid learning content status",
            400
        );

    }


    /*
     * Find Learning Content
     */

    const learningContent =
        await LearningContent.findById(id);


    if (!learningContent) {

        throw new AppError(
            "Learning content not found",
            404
        );

    }


    /*
     * Validate completion weight when activating
     */

    if (
        status === LEARNING_CONTENT_STATUS.ACTIVE &&
        learningContent.status !==
            LEARNING_CONTENT_STATUS.ACTIVE
    ) {

        const currentTotal =
            await getActiveCompletionWeightTotal(
                learningContent.topic
            );


        if (
            currentTotal +
            learningContent.completionWeight >
            100
        ) {

            throw new AppError(
                `Cannot activate learning content. Completion weight would exceed 100%. Current active total: ${currentTotal}%.`,
                400
            );

        }

    }


    /*
     * Update Learning Content Status
     */

    learningContent.status = status;


    await learningContent.save();


    return learningContent;

};