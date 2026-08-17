import asyncHandler from "../utils/asyncHandler.js";

import {
    createLearningContent as createLearningContentService,
    getLearningContentByTopic as getLearningContentByTopicService,
    updateLearningContent as updateLearningContentService,
    updateLearningContentStatus as updateLearningContentStatusService
} from "../services/learningContentService.js";


export const createLearningContent = asyncHandler(
    async (req, res) => {

        const {
            topic,
            title,
            content,
            sequence,
            completionWeight
        } = req.body;


        const learningContent =
            await createLearningContentService({
                topic,
                title,
                content,
                sequence,
                completionWeight
            });


        res.status(201).json({
            success: true,
            message: "Learning content created successfully",
            data: learningContent
        });

    }
);

export const getLearningContentByTopic = asyncHandler(
    async (req, res) => {

        const { topicId } = req.params;

        const learningContent =
            await getLearningContentByTopicService(
                topicId
            );

        res.status(200).json({
            success: true,
            message: "Learning content fetched successfully",
            data: learningContent
        });

    }
);

export const updateLearningContent = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const {
        title,
        content,
        sequence,
        completionWeight
    } = req.body;


    const learningContent =
        await updateLearningContentService(
            id,
            {
                title,
                content,
                sequence,
                completionWeight
            }
        );


    res.status(200).json({

        success: true,

        message:
            "Learning content updated successfully",

        data: learningContent

    });

});

export const updateLearningContentStatus = asyncHandler(
    async (req, res) => {

        const { id } = req.params;

        const { status } = req.body;

        const learningContent =
            await updateLearningContentStatusService(
                id,
                status
            );

        res.status(200).json({

            success: true,

            message:
                "Learning content status updated successfully",

            data: learningContent

        });

    }
);