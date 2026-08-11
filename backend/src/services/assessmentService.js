import mongoose from "mongoose";
import Assessment from "../models/Assessment.js";
import User from "../models/Users.js";
import AppError from "../utils/AppError.js";
import { ASSESSMENT_STATUS } from "../constants/assessmentStatus.js";


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