import asyncHandler from "../utils/asyncHandler.js";

import {
    createQuestion as createQuestionService,
    getAllQuestions as getAllQuestionsService,
    getQuestionById as getQuestionByIdService,
    updateQuestionStatus as updateQuestionStatusService
} from "../services/questionService.js";
export const createQuestion = asyncHandler(async (req, res) => {

    const question = await createQuestionService(req.body);

    res.status(201).json({
        success: true,
        message: "Question created successfully",
        data: question
    });
});

export const getAllQuestions = asyncHandler(async (req, res) => {

    const questions = await getAllQuestionsService();

    res.status(200).json({
        success: true,
        data: questions
    });
});

export const getQuestionById = asyncHandler(async (req, res) => {

    const question = await getQuestionByIdService(req.params.id);

    res.status(200).json({
        success: true,
        data: question
    });
});

export const updateQuestionStatus = asyncHandler(
    async (req, res) => {

        const question = await updateQuestionStatusService(
            req.params.id,
            req.body.status
        );

        res.status(200).json({
            success: true,
            message: "Question status updated successfully",
            data: question
        });
    }
);