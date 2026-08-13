import mongoose from "mongoose";
import { LEARNING_ACTIVITY_STATUS } from "../constants/learningActivityStatus.js";

const learningActivitySchema = new mongoose.Schema(
    {
        topic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic_CGPT",
            required: [true, "Learning activity topic is required"]
        },

        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question_CGPT",
            required: [true, "Learning activity question is required"]
        },

        completionWeight: {
            type: Number,
            required: [true, "Completion weight is required"],
            min: [0, "Completion weight cannot be negative"],
            max: [100, "Completion weight cannot exceed 100"]
        },

        sequence: {
            type: Number,
            required: [true, "Learning activity sequence is required"],
            min: [1, "Learning activity sequence must be at least 1"]
        },

        status: {
            type: String,
            enum: Object.values(LEARNING_ACTIVITY_STATUS),
            default: LEARNING_ACTIVITY_STATUS.ACTIVE
        }
    },
    {
        timestamps: true
    }
);

learningActivitySchema.index(
    {
        topic: 1,
        question: 1
    },
    {
        unique: true
    }
);

learningActivitySchema.index(
    {
        topic: 1,
        sequence: 1
    },
    {
        unique: true
    }
);

const LearningActivity = mongoose.model(
    "LearningActivity_CGPT",
    learningActivitySchema
);

export default LearningActivity;