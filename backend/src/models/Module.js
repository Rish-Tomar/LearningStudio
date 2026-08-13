import mongoose from "mongoose";
import { MODULE_STATUS } from "../constants/moduleStatus.js";

const moduleSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course_CGPT",
            required: [true, "Course is required"]
        },

        name: {
            type: String,
            required: [true, "Module name is required"],
            trim: true,
            minlength: 2,
            maxlength: 150
        },

        code: {
            type: String,
            required: [true, "Module code is required"],
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
            required: [true, "Module sequence is required"],
            min: [1, "Module sequence must be at least 1"]
        },

        status: {
            type: String,
            enum: Object.values(MODULE_STATUS),
            default: MODULE_STATUS.ACTIVE
        }
    },
    {
        timestamps: true
    }
);

moduleSchema.index(
    { course: 1, code: 1 },
    { unique: true }
);

moduleSchema.index(
    { course: 1, sequence: 1 },
    { unique: true }
);

const Module = mongoose.model("Module_CGPT", moduleSchema);

export default Module;