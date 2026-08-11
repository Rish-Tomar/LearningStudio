import mongoose from "mongoose";
import AssessmentQuestion from "../models/AssessmentQuestion.js";
import Assessment from "../models/Assessment.js";
import AssessmentSection from "../models/AssessmentSection.js";
import Question from "../models/Question.js";
import AppError from "../utils/AppError.js";
import { ASSESSMENT_STATUS } from "../constants/assessmentStatus.js";


export const createAssessmentQuestion = async ({
    assessment,
    section,
    question,
    order,
    marks
}) => {

    // 1. Validate Assessment ID
    if (!mongoose.Types.ObjectId.isValid(assessment)) {
        throw new AppError(
            "Invalid assessment ID",
            400
        );
    }


    // 2. Validate Section ID
    if (!mongoose.Types.ObjectId.isValid(section)) {
        throw new AppError(
            "Invalid section ID",
            400
        );
    }


    // 3. Validate Question ID
    if (!mongoose.Types.ObjectId.isValid(question)) {
        throw new AppError(
            "Invalid question ID",
            400
        );
    }


    // 4. Verify Assessment exists
    const existingAssessment = await Assessment.findById(
        assessment
    );

    if (!existingAssessment) {
        throw new AppError(
            "Assessment not found",
            404
        );
    }


    // 5. Assessment must still be DRAFT
    if (existingAssessment.status !== ASSESSMENT_STATUS.DRAFT) {
        throw new AppError(
            "Questions can only be added to a draft assessment",
            400
        );
    }


    // 6. Verify Section exists
    const existingSection = await AssessmentSection.findById(
        section
    );

    if (!existingSection) {
        throw new AppError(
            "Assessment section not found",
            404
        );
    }


    // 7. Ensure Section belongs to Assessment
    if (
        existingSection.assessment.toString() !==
        assessment.toString()
    ) {
        throw new AppError(
            "Section does not belong to this assessment",
            400
        );
    }


    // 8. Verify Question exists
    const existingQuestion = await Question.findById(
        question
    );

    if (!existingQuestion) {
        throw new AppError(
            "Question not found",
            404
        );
    }


    // 9. Ensure Question type matches Section type
    if (
        existingQuestion.questionType !==
        existingSection.questionType
    ) {
        throw new AppError(
            "Question type does not match section type",
            400
        );
    }


    // 10. Validate order
    if (!Number.isInteger(order) || order < 1) {
        throw new AppError(
            "Question order must be a positive integer",
            400
        );
    }


    // 11. Validate marks
    if (
        typeof marks !== "number" ||
        marks <= 0
    ) {
        throw new AppError(
            "Question marks must be greater than 0",
            400
        );
    }


    // 12. Prevent duplicate question order in section
    const existingOrder = await AssessmentQuestion.findOne({
        section,
        order
    });

    if (existingOrder) {
        throw new AppError(
            "Question order already exists in this section",
            409
        );
    }


    // 13. Prevent same Question from being added
    //    twice to the same section
    const existingQuestionEntry =
        await AssessmentQuestion.findOne({
            section,
            question
        });

    if (existingQuestionEntry) {
        throw new AppError(
            "Question already exists in this section",
            409
        );
    }


    // 14. Create AssessmentQuestion
    const assessmentQuestion =
        await AssessmentQuestion.create({
            assessment,
            section,
            question,
            order,
            marks
        });


    return assessmentQuestion;
};