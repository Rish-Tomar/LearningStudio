import mongoose from "mongoose";
import { TEST_CASE_VISIBILITY } from "../constants/testCaseVisibility.js";

const testCaseSchema = new mongoose.Schema(
    {
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question_CGPT",
            required: [true, "Question is required"]
        },

        input: {
            type: String,
            required: [true, "Test case input is required"],
            trim: true
        },

        expectedOutput: {
            type: String,
            required: [true, "Expected output is required"],
            trim: true
        },

        visibility: {
            type: String,
            enum: Object.values(TEST_CASE_VISIBILITY),
            default: TEST_CASE_VISIBILITY.HIDDEN
        },

        weight: {
            type: Number,
            required: [true, "Test case weight is required"],
            min: 1,
            default:1
        },

        executionOrder: {
            type: Number,
            required: [true, "Execution order is required"],
            min: 1
        }
    },
    {
        timestamps: true
    }
);

const TestCase = mongoose.model("TestCase_CGPT", testCaseSchema);

export default TestCase;