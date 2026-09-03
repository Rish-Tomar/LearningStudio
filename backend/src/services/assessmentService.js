import mongoose from "mongoose";
import Assessment from "../models/Assessment.js";
import User from "../models/Users.js";
import AppError from "../utils/AppError.js";
import { ASSESSMENT_STATUS } from "../constants/assessmentStatus.js";
import AssessmentSection from "../models/AssessmentSection.js";
import AssessmentQuestion from "../models/AssessmentQuestion.js";
import { QUESTION_STATUS } from "../constants/questionStatus.js";

export const createAssessment = async ({
    code,
    title,
    description,
    duration,
    startAt,
    endAt,
    createdBy
}) => {

    // 1. Validate creator ID
    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
        throw new AppError(
            "Invalid creator ID",
            400
        );
    }


    // 2. Verify creator exists
    const creator = await User.findById(createdBy);

    if (!creator) {
        throw new AppError(
            "Assessment creator not found",
            404
        );
    }


    // 3. Validate assessment code
    const existingAssessment = await Assessment.findOne({
        code: code.toUpperCase()
    });

    if (existingAssessment) {
        throw new AppError(
            "Assessment with this code already exists",
            409
        );
    }


    // 4. Validate dates
    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    if (
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
    ) {
        throw new AppError(
            "Invalid assessment start or end time",
            400
        );
    }


    if (endDate <= startDate) {
        throw new AppError(
            "Assessment end time must be after start time",
            400
        );
    }


    // 5. Validate duration
    if (!Number.isInteger(duration) || duration <= 0) {
        throw new AppError(
            "Assessment duration must be a positive integer",
            400
        );
    }


    // 6. Create Assessment
    const assessment = await Assessment.create({
        code: code.toUpperCase(),
        title,
        description,
        duration,
        startAt: startDate,
        endAt: endDate,
        createdBy,
        status: ASSESSMENT_STATUS.DRAFT
    });


    return assessment;
};


export const getAllAssessments = async () => {

    const assessments = await Assessment.find()
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 });

    return assessments;
};


export const getAssessmentById = async (id) => {

    // 1. Validate Assessment ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(
            "Invalid assessment ID",
            400
        );
    }


    // 2. Find Assessment
    const assessment = await Assessment.findById(id)
        .populate("createdBy", "name email role");

    if (!assessment) {
        throw new AppError(
            "Assessment not found",
            404
        );
    }


    // 3. Get Sections
    const sections = await AssessmentSection.find({
        assessment: id
    }).sort({
        order: 1
    });


    // 4. Get Assessment Questions
    const assessmentQuestions =
        await AssessmentQuestion.find({
            assessment: id
        })
        .populate(
            "question",
            "-correctAnswer -explanation"
        )
        .sort({
            order: 1
        });


    // 5. Build nested response
    const sectionsWithQuestions = sections.map(
        (section) => {

            const sectionQuestions =
                assessmentQuestions
                    .filter(
                        (aq) =>
                            aq.section.toString() ===
                            section._id.toString()
                    )
                    .sort(
                        (a, b) => a.order - b.order
                    );


            return {
                ...section.toObject(),
                questions: sectionQuestions
            };
        }
    );


    return {
        ...assessment.toObject(),
        sections: sectionsWithQuestions
    };
};


/*
 * Update Assessment
 *
 * Only DRAFT assessments can be edited.
 *
 * Editable fields:
 * - title
 * - description
 * - duration
 * - startAt
 * - endAt
 *
 * Immutable fields:
 * - code
 * - status
 * - createdBy
 */
export const updateAssessment = async (
    id,
    {
        title,
        description,
        duration,
        startAt,
        endAt
    }
) => {

    // 1. Validate Assessment ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(
            "Invalid assessment ID",
            400
        );
    }


    // 2. Find Assessment
    const assessment = await Assessment.findById(id);

    if (!assessment) {
        throw new AppError(
            "Assessment not found",
            404
        );
    }


    // 3. Assessment must be DRAFT
    if (
        assessment.status !==
        ASSESSMENT_STATUS.DRAFT
    ) {
        throw new AppError(
            "Only draft assessments can be edited",
            400
        );
    }


    // 4. Validate title
    if (
        typeof title !== "string" ||
        !title.trim()
    ) {
        throw new AppError(
            "Assessment title is required",
            400
        );
    }


    if (title.trim().length < 3) {
        throw new AppError(
            "Assessment title must be at least 3 characters",
            400
        );
    }


    if (title.trim().length > 200) {
        throw new AppError(
            "Assessment title cannot exceed 200 characters",
            400
        );
    }


    // 5. Validate description
    if (
        description !== undefined &&
        description !== null &&
        typeof description !== "string"
    ) {
        throw new AppError(
            "Assessment description must be text",
            400
        );
    }


    if (
        typeof description === "string" &&
        description.trim().length > 1000
    ) {
        throw new AppError(
            "Assessment description cannot exceed 1000 characters",
            400
        );
    }


    // 6. Validate duration
    const numericDuration = Number(duration);

    if (
        !Number.isInteger(numericDuration) ||
        numericDuration <= 0
    ) {
        throw new AppError(
            "Assessment duration must be a positive integer",
            400
        );
    }


    // 7. Validate dates
    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    if (
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
    ) {
        throw new AppError(
            "Invalid assessment start or end time",
            400
        );
    }


    // 8. End time must be after start time
    if (endDate <= startDate) {
        throw new AppError(
            "Assessment end time must be after start time",
            400
        );
    }


    // 9. Update editable fields
    assessment.title = title.trim();

    assessment.description =
        typeof description === "string"
            ? description.trim()
            : "";

    assessment.duration =
        numericDuration;

    assessment.startAt =
        startDate;

    assessment.endAt =
        endDate;


    // 10. Save
    await assessment.save();


    return assessment;
};


export const publishAssessment = async (id) => {

    // 1. Validate Assessment ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(
            "Invalid assessment ID",
            400
        );
    }


    // 2. Find Assessment
    const assessment = await Assessment.findById(id);

    if (!assessment) {
        throw new AppError(
            "Assessment not found",
            404
        );
    }


    // 3. Assessment must be DRAFT
    if (
        assessment.status !==
        ASSESSMENT_STATUS.DRAFT
    ) {
        throw new AppError(
            "Only draft assessments can be published",
            400
        );
    }


    // 4. Get Sections
    const sections = await AssessmentSection.find({
        assessment: id
    }).sort({
        order: 1
    });


    // 5. Assessment must have at least one section
    if (sections.length === 0) {
        throw new AppError(
            "Assessment must have at least one section before publishing",
            400
        );
    }


    // 6. Get all Assessment Questions
    const assessmentQuestions =
        await AssessmentQuestion.find({
            assessment: id
        }).populate("question");


    // 7. Every section must contain at least one question
    for (const section of sections) {

        const sectionQuestions =
            assessmentQuestions.filter(
                (aq) =>
                    aq.section.toString() ===
                    section._id.toString()
            );

        if (sectionQuestions.length === 0) {
            throw new AppError(
                `Section "${section.name}" must contain at least one question`,
                400
            );
        }
    }


    // 8. Every question must be ACTIVE
    for (
        const assessmentQuestion
        of assessmentQuestions
    ) {

        if (
            !assessmentQuestion.question ||
            assessmentQuestion.question.status !==
                QUESTION_STATUS.ACTIVE
        ) {
            throw new AppError(
                "All questions in the assessment must be active",
                400
            );
        }
    }


    // 9. Publish Assessment
    assessment.status =
        ASSESSMENT_STATUS.PUBLISHED;

    await assessment.save();


    return assessment;
};


export const closeAssessment = async (id) => {

    // 1. Validate Assessment ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(
            "Invalid assessment ID",
            400
        );
    }


    // 2. Find Assessment
    const assessment =
        await Assessment.findById(id);

    if (!assessment) {
        throw new AppError(
            "Assessment not found",
            404
        );
    }


    // 3. Assessment must be PUBLISHED
    if (
        assessment.status !==
        ASSESSMENT_STATUS.PUBLISHED
    ) {
        throw new AppError(
            "Only published assessments can be closed",
            400
        );
    }


    // 4. Close Assessment
    assessment.status =
        ASSESSMENT_STATUS.CLOSED;

    await assessment.save();


    return assessment;
};