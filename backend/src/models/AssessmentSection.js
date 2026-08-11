import mongoose from "mongoose";
import { QUESTION_TYPE } from "../constants/questionType.js";

const assessmentSectionSchema = new mongoose.Schema(
    {
        assessment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assessment_CGPT",
            required: [true, "Assessment is required"]
        },

        name: {
            type: String,
            required: [true, "Section name is required"],
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500
        },

        questionType: {
            type: String,
            enum: Object.values(QUESTION_TYPE),
            required: [true, "Section question type is required"]
        },

        order: {
            type: Number,
            required: [true, "Section order is required"],
            min: [1, "Section order must start from 1"]
        }
    },
    {
        timestamps: true
    }
);

const AssessmentSection = mongoose.model(
    "AssessmentSection_CGPT",
    assessmentSectionSchema
);

export default AssessmentSection;