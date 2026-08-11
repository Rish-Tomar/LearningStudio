import mongoose from "mongoose";
import { ASSESSMENT_STATUS } from "../constants/assessmentStatus.js";

const assessmentSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Assessment code is required"],
            unique: true,
            trim: true,
            uppercase: true,
            minlength: 3,
            maxlength: 50
        },

        title: {
            type: String,
            required: [true, "Assessment title is required"],
            trim: true,
            minlength: 3,
            maxlength: 200
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000
        },

        status: {
            type: String,
            enum: Object.values(ASSESSMENT_STATUS),
            default: ASSESSMENT_STATUS.DRAFT
        },

        duration: {
            type: Number,
            required: [true, "Assessment duration is required"],
            min: [1, "Assessment duration must be at least 1 minute"]
        },

        startAt: {
            type: Date,
            required: [true, "Assessment start time is required"]
        },

        endAt: {
            type: Date,
            required: [true, "Assessment end time is required"]
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User_CGPT",
            required: [true, "Assessment creator is required"]
        }
    },
    {
        timestamps: true
    }
);

const Assessment = mongoose.model(
    "Assessment_CGPT",
    assessmentSchema
);

export default Assessment;