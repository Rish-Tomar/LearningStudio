import mongoose from "mongoose";
import { QUESTION_TYPE } from "../constants/questionType.js";
import { QUESTION_DIFFICULTY } from "../constants/questionDifficulty.js";
import { QUESTION_STATUS } from "../constants/questionStatus.js";

const questionSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Question code is required"],
            unique: true,
            trim: true,
            uppercase: true,
            minlength: 3,
            maxlength: 50
        },

        title: {
            type: String,
            required: [true, "Question title is required"],
            trim: true,
            minlength: 3,
            maxlength: 200
        },

        description: {
            type: String,
            required: [true, "Question description is required"],
            trim: true
        },

        topic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic_CGPT",
            required: [true, "Topic is required"]
        },

        questionType: {
            type: String,
            required: [true, "Question type is required"],
            enum: Object.values(QUESTION_TYPE)
        },

        difficulty: {
            type: String,
            required: [true, "Question difficulty is required"],
            enum: Object.values(QUESTION_DIFFICULTY)
        },

        status: {
            type: String,
            enum: Object.values(QUESTION_STATUS),
            default: QUESTION_STATUS.ACTIVE
        },
        options: [
            {
                key: {
                    type: String,
                    required: true,
                    enum: ["A", "B", "C", "D", "E", "F"]
                },

                text: {
                    type: String,
                    required: true,
                    trim: true
                }
            }
        ],
        correctAnswer: {
            type: String,
            trim: true,
            uppercase: true
        },

        explanation: {
            type: String,
            trim: true
        },
        constraints: {
            type: [String],
            default: []
        },

        inputFormat: {
            type: String,
            trim: true
        },

        outputFormat: {
            type: String,
            trim: true
        },

        allowedLanguages: {
            type: [String],
            default: []
        },

        executionTimeLimit: {
            type: Number,
            min: 100
        },

        memoryLimit: {
            type: Number,
            min: 16
        },
    },
    {
        timestamps: true
    }
);

questionSchema.pre("validate", function () {

   if (this.questionType === QUESTION_TYPE.MCQ) {

        if (!this.options || this.options.length < 2) {
            this.invalidate(
                "options",
                "MCQ must have at least 2 options"
            );
        }

        if (this.options && this.options.length > 6) {
            this.invalidate(
                "options",
                "MCQ cannot have more than 6 options"
            );
        }

        if (this.options && this.options.length > 0) {

            const optionKeys = this.options.map(
                option => option.key
            );

            const uniqueKeys = new Set(optionKeys);

            if (uniqueKeys.size !== optionKeys.length) {
                this.invalidate(
                    "options",
                    "MCQ option keys must be unique"
                );
            }

            if (
                this.correctAnswer &&
                !optionKeys.includes(this.correctAnswer)
            ) {
                this.invalidate(
                    "correctAnswer",
                    "Correct answer must match one of the option keys"
                );
            }
        }

        if (!this.correctAnswer) {
            this.invalidate(
                "correctAnswer",
                "MCQ must have a correct answer"
            );
        }
    }

    if (this.questionType === QUESTION_TYPE.CODING) {

        if (!this.inputFormat) {
            this.invalidate(
                "inputFormat",
                "Coding question requires input format"
            );
        }

        if (!this.outputFormat) {
            this.invalidate(
                "outputFormat",
                "Coding question requires output format"
            );
        }

        if (!this.allowedLanguages || this.allowedLanguages.length === 0) {
            this.invalidate(
                "allowedLanguages",
                "Coding question must specify at least one allowed language"
            );
        }

        if (!this.executionTimeLimit) {
            this.invalidate(
                "executionTimeLimit",
                "Coding question requires execution time limit"
            );
        }

        if (!this.memoryLimit) {
            this.invalidate(
                "memoryLimit",
                "Coding question requires memory limit"
            );
        }
    }
});
const Question = mongoose.model("Question_CGPT", questionSchema);

export default Question;