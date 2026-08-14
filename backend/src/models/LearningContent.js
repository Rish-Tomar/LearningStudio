import mongoose from "mongoose";
import { LEARNING_CONTENT_STATUS } from "../constants/learningContentStatus.js";
const learningContentSchema = new mongoose.Schema(
    {
        topic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic_CGPT",
            required: [true, "Learning content topic is required"]
        },

        title: {
            type: String,
            required: [true, "Learning content title is required"],
            trim: true,
            minlength: 2,
            maxlength: 200
        },

        content: {
            type: String,
            required: [true, "Learning content is required"],
            trim: true
        },

        sequence: {
            type: Number,
            required: [true, "Learning content sequence is required"],
            min: [1, "Learning content sequence must be at least 1"]
        },

        completionWeight: {
            type: Number,
            required: [true, "Completion weight is required"],
            min: [0, "Completion weight cannot be negative"],
            max: [100, "Completion weight cannot exceed 100"]
        },

        status: {
            type: String,
            enum: Object.values(LEARNING_CONTENT_STATUS),
            default: LEARNING_CONTENT_STATUS.ACTIVE
        }
    },
    {
        timestamps: true
    }
);

learningContentSchema.index(
    {
        topic: 1,
        sequence: 1
    },
    {
        unique: true
    }
);

const LearningContent = mongoose.model(
    "LearningContent_CGPT",
    learningContentSchema
);

export default LearningContent;