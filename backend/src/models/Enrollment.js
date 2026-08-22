import mongoose from "mongoose";

import { ENROLLMENT_STATUS } from "../constants/enrollmentStatus.js";
import { ENROLLMENT_METHOD } from "../constants/enrollmentMethod.js";

const enrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User_CGPT",
            required: [true, "Student is required"]
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course_CGPT",
            required: [true, "Course is required"]
        },

        status: {
            type: String,
            enum: Object.values(ENROLLMENT_STATUS),
            default: ENROLLMENT_STATUS.PENDING
        },

        enrollmentMethod: {
            type: String,
            enum: Object.values(ENROLLMENT_METHOD),
            required: [true, "Enrollment method is required"]
        },

        requestedAt: {
            type: Date,
            default: null
        },

        approvedAt: {
            type: Date,
            default: null
        },

        rejectedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

/*
 * A student can have only one enrollment
 * record for a particular course.
 */
enrollmentSchema.index(
    {
        student: 1,
        course: 1
    },
    {
        unique: true
    }
);

const Enrollment = mongoose.model(
    "Enrollment_CGPT",
    enrollmentSchema
);

export default Enrollment;