import mongoose from "mongoose";

const assessmentQuestionSchema = new mongoose.Schema(
    {
        assessment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assessment_CGPT",
            required: [true, "Assessment is required"]
        },

        section: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AssessmentSection_CGPT",
            required: [true, "Section is required"]
        },

        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question_CGPT",
            required: [true, "Question is required"]
        },

        order: {
            type: Number,
            required: [true, "Question order is required"],
            min: [1, "Question order must start from 1"]
        },

        marks: {
            type: Number,
            required: [true, "Question marks are required"],
            min: [0, "Question marks cannot be negative"]
        }
    },
    {
        timestamps: true
    }
);

const AssessmentQuestion = mongoose.model(
    "AssessmentQuestion_CGPT",
    assessmentQuestionSchema
);

export default AssessmentQuestion;