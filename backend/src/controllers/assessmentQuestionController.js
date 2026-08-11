import asyncHandler from "../utils/asyncHandler.js";

import {
    createAssessmentQuestion as createAssessmentQuestionService
} from "../services/assessmentQuestionService.js";


export const createAssessmentQuestion = asyncHandler(
    async (req, res) => {

        const assessmentQuestion =
            await createAssessmentQuestionService(req.body);

        res.status(201).json({
            success: true,
            message: "Question added to assessment successfully",
            data: assessmentQuestion
        });
    }
);