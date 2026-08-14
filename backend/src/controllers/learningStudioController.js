import asyncHandler from "../utils/asyncHandler.js";

import {
    getLearningStudioTopic as getLearningStudioTopicService
} from "../services/learningStudioService.js";


export const getLearningStudioTopic = asyncHandler(
    async (req, res) => {

        const { topicId } = req.params;

        const learningStudio =
            await getLearningStudioTopicService(
                topicId
            );

        res.status(200).json({
            success: true,
            message: "Learning Studio topic fetched successfully",
            data: learningStudio
        });

    }
);