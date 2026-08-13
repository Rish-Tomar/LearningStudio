import asyncHandler from "../utils/asyncHandler.js";

import {
     getLearningActivitiesByTopic as getLearningActivitiesByTopicService,
    createLearningActivity as createLearningActivityService
} from "../services/learningActivityService.js";


export const createLearningActivity = asyncHandler(
    async (req, res) => {

        const {
            topic,
            question,
            completionWeight,
            sequence
        } = req.body;


        const learningActivity =
            await createLearningActivityService({
                topic,
                question,
                completionWeight,
                sequence
            });


        res.status(201).json({
            success: true,
            message: "Learning activity created successfully",
            data: learningActivity
        });

    }
);

export const getLearningActivitiesByTopic = asyncHandler(
    async (req, res) => {

        const { topicId } = req.params;

        const learningActivities =
            await getLearningActivitiesByTopicService(
                topicId
            );

        res.status(200).json({
            success: true,
            message: "Learning activities fetched successfully",
            data: learningActivities
        });

    }
);