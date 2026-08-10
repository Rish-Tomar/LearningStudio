import asyncHandler from "../utils/asyncHandler.js";
import {
    createQuestion as createQuestionService
} from "../services/questionService.js";

export const createQuestion = asyncHandler(async (req, res) => {

    const question = await createQuestionService(req.body);

    res.status(201).json({
        success: true,
        message: "Question created successfully",
        data: question
    });
});