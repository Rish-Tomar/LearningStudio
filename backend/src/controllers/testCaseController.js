import asyncHandler from "../utils/asyncHandler.js";

import {
    createTestCase as createTestCaseService,
    getTestCasesByQuestion as getTestCasesByQuestionService,
    getPublicTestCasesByQuestion as getPublicTestCasesByQuestionService
} from "../services/testCaseService.js";

export const createTestCase = asyncHandler(async (req, res) => {

    const testCase = await createTestCaseService(req.body);

    res.status(201).json({
        success: true,
        message: "Test case created successfully",
        data: testCase
    });

});

export const getTestCasesByQuestion = asyncHandler(async (req, res) => {

    const testCases = await getTestCasesByQuestionService(
        req.params.questionId
    );

    res.status(200).json({
        success: true,
        data: testCases
    });
});

export const getPublicTestCasesByQuestion = asyncHandler(
    async (req, res) => {

        const testCases =
            await getPublicTestCasesByQuestionService(
                req.params.questionId
            );

        res.status(200).json({
            success: true,
            data: testCases
        });
    }
);