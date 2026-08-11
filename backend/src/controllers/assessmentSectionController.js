import asyncHandler from "../utils/asyncHandler.js";

import {
    createAssessmentSection as createAssessmentSectionService
} from "../services/assessmentSectionService.js";


export const createAssessmentSection = asyncHandler(
    async (req, res) => {

        const section =
            await createAssessmentSectionService(req.body);

        res.status(201).json({
            success: true,
            message: "Assessment section created successfully",
            data: section
        });
    }
);