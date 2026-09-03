import mongoose from "mongoose";

const quizResponseSchema = new mongoose.Schema(
    {
        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "QuizSession_CGPT",
            required: [true, "Quiz session is required"],
            index: true
        },

        attempt: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "QuizAttempt_CGPT",
            required: [true, "Quiz attempt is required"],
            index: true
        },

        assessmentQuestion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AssessmentQuestion_CGPT",
            required: [true, "Assessment question is required"],
            index: true
        },

        selectedAnswer: {
            type: String,
            trim: true,
            uppercase: true
        },

        isCorrect: {
            type: Boolean,
            default: false
        },

        pointsEarned: {
            type: Number,
            default: 0,
            min: 0
        },

        responseTimeMs: {
            type: Number,
            min: 0
        },

        answeredAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

quizResponseSchema.index(
    {
        attempt: 1,
        assessmentQuestion: 1
    },
    {
        unique: true
    }
);

const QuizResponse = mongoose.model(
    "QuizResponse_CGPT",
    quizResponseSchema
);

export default QuizResponse;