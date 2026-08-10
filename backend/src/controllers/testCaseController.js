import asyncHandler from "../utils/asyncHandler.js";

import {
    createTestCase as createTestCaseService
} from "../services/testCaseService.js";


export const createTestCase = asyncHandler(async (req, res) => {

    const testCase = await createTestCaseService(req.body);

    res.status(201).json({
        success: true,
        message: "Test case created successfully",
        data: testCase
    });

});