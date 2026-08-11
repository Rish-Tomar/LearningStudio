import asyncHandler from "../utils/asyncHandler.js";

import {
    createAssessment as createAssessmentService
} from "../services/assessmentService.js";


export const createAssessment = asyncHandler(async (req, res) => {

    const assessment = await createAssessmentService(req.body);

    res.status(201).json({
        success: true,
        message: "Assessment created successfully",
        data: assessment
    });

});