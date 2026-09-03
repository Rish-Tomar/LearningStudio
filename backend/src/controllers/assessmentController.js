import asyncHandler from "../utils/asyncHandler.js";

import {
    createAssessment as createAssessmentService,
    getAllAssessments as getAllAssessmentsService,
    getAssessmentById as getAssessmentByIdService,
    updateAssessment as updateAssessmentService,
    publishAssessment as publishAssessmentService,
    closeAssessment as closeAssessmentService
} from "../services/assessmentService.js";

export const createAssessment = asyncHandler(async (req, res) => {

    const assessment =
        await createAssessmentService(req.body);

    res.status(201).json({
        success: true,
        message: "Assessment created successfully",
        data: assessment
    });

});

export const getAllAssessments = asyncHandler(async (req, res) => {

    const assessments =
        await getAllAssessmentsService();

    res.status(200).json({
        success: true,
        data: assessments
    });

});

export const getAssessmentById = asyncHandler(async (req, res) => {

    const assessment =
        await getAssessmentByIdService(req.params.id);

    res.status(200).json({
        success: true,
        data: assessment
    });

});

export const updateAssessment = asyncHandler(
    async (req, res) => {

        const assessment =
            await updateAssessmentService(
                req.params.id,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Assessment updated successfully",
            data: assessment
        });

    }
);

export const publishAssessment = asyncHandler(
    async (req, res) => {

        const assessment =
            await publishAssessmentService(req.params.id);

        res.status(200).json({
            success: true,
            message: "Assessment published successfully",
            data: assessment
        });

    }
);

export const closeAssessment = asyncHandler(
    async (req, res) => {

        const assessment =
            await closeAssessmentService(req.params.id);

        res.status(200).json({
            success: true,
            message: "Assessment closed successfully",
            data: assessment
        });

    }
);