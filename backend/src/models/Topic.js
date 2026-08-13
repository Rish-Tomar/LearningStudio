import mongoose from "mongoose";
import { TOPIC_STATUS } from "../constants/topicStatus.js";

const topicSchema = new mongoose.Schema(
    {
        module: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module_CGPT"
        },

        name: {
            type: String,
            required: [true, "Topic name is required"],
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        code: {
            type: String,
            required: [true, "Topic code is required"],
            unique: true,
            uppercase: true,
            trim: true,
            maxlength: 30
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500
        },

        sequence: {
            type: Number,
            min: [1, "Topic sequence must be at least 1"]
        },

        status: {
            type: String,
            enum: Object.values(TOPIC_STATUS),
            default: TOPIC_STATUS.ACTIVE
        }
    },
    {
        timestamps: true
    }
);

topicSchema.index(
    { module: 1, sequence: 1 },
    {
        unique: true,
        partialFilterExpression: {
            module: { $exists: true },
            sequence: { $exists: true }
        }
    }
);

const Topic = mongoose.model("Topic_CGPT", topicSchema);

export default Topic;