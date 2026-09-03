import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
    {
        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "QuizSession_CGPT",
            required: [true, "Quiz session is required"],
            index: true
        },

        assessment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assessment_CGPT",
            required: [true, "Assessment is required"],
            index: true
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User_CGPT",
            required: [true, "Student is required"],
            index: true
        },

        status: {
            type: String,
            enum: [
                "JOINED",
                "IN_PROGRESS",
                "SUBMITTED",
                "TIMED_OUT"
            ],
            default: "JOINED"
        },

        startedAt: {
            type: Date
        },

        submittedAt: {
            type: Date
        },

        currentQuestion: {
            type: Number,
            default: 0,
            min: 0
        },

        attemptedQuestions: {
            type: Number,
            default: 0,
            min: 0
        },

        correctAnswers: {
            type: Number,
            default: 0,
            min: 0
        },

        totalPoints: {
            type: Number,
            default: 0,
            min: 0
        },

        currentStreak: {
            type: Number,
            default: 0,
            min: 0
        },

        longestStreak: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

quizAttemptSchema.index(
    {
        session: 1,
        student: 1
    },
    {
        unique: true
    }
);

const QuizAttempt = mongoose.model(
    "QuizAttempt_CGPT",
    quizAttemptSchema
);

export default QuizAttempt;