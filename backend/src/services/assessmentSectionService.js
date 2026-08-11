import mongoose from "mongoose";
import AssessmentSection from "../models/AssessmentSection.js";
import Assessment from "../models/Assessment.js";
import AppError from "../utils/AppError.js";
import { ASSESSMENT_STATUS } from "../constants/assessmentStatus.js";
import { QUESTION_TYPE } from "../constants/questionType.js";


export const createAssessmentSection = async ({
    assessment,
    name,
    description,
    questionType,
    order
}) => {

    // 1. Validate Assessment ID
    if (!mongoose.Types.ObjectId.isValid(assessment)) {
        throw new AppError(
            "Invalid assessment ID",
            400
        );
    }


    // 2. Verify Assessment exists
    const existingAssessment = await Assessment.findById(
        assessment
    );

    if (!existingAssessment) {
        throw new AppError(
            "Assessment not found",
            404
        );
    }


    // 3. Section can only be added to DRAFT Assessment
    if (existingAssessment.status !== ASSESSMENT_STATUS.DRAFT) {
        throw new AppError(
            "Sections can only be added to a draft assessment",
            400
        );
    }


    // 4. Validate question type
    if (!Object.values(QUESTION_TYPE).includes(questionType)) {
        throw new AppError(
            "Invalid section question type",
            400
        );
    }


    // 5. Validate order
    if (!Number.isInteger(order) || order < 1) {
        throw new AppError(
            "Section order must be a positive integer",
            400
        );
    }


    // 6. Prevent duplicate section order
    const existingSection = await AssessmentSection.findOne({
        assessment,
        order
    });

    if (existingSection) {
        throw new AppError(
            "Section order already exists for this assessment",
            409
        );
    }


    // 7. Create Section
    const section = await AssessmentSection.create({
        assessment,
        name,
        description,
        questionType,
        order
    });


    return section;
};