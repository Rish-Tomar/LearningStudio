import mongoose from "mongoose";

import { QUIZ_SESSION_STATUS } from "../../constants/quizSessionStatus.js";
import { QUIZ_SESSION_MODE } from "../../constants/quizSessionMode.js";

const quizSessionSchema = new mongoose.Schema(
    {
        assessment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assessment_CGPT",
            required: [true, "Assessment is required"],
            index: true
        },

        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User_CGPT",
            required: [true, "Quiz host is required"],
            index: true
        },

        joinCode: {
            type: String,
            required: [true, "Join code is required"],
            unique: true,
            uppercase: true,
            trim: true,
            minlength: 6,
            maxlength: 6,
            index: true
        },

        mode: {
            type: String,
            enum: Object.values(QUIZ_SESSION_MODE),
            default: QUIZ_SESSION_MODE.STUDENT_PACED,
            required: true
        },

        status: {
            type: String,
            enum: Object.values(QUIZ_SESSION_STATUS),
            default: QUIZ_SESSION_STATUS.WAITING,
            required: true,
            index: true
        },

        maxParticipants: {
            type: Number,
            default: 65,
            min: 1,
            max: 500
        },

        duration: {
            type: Number,
            required: [true, "Session duration is required"],
            min: 1
        },

        startedAt: {
            type: Date
        },

        endedAt: {
            type: Date
        },

        gamification: {
            enabled: {
                type: Boolean,
                default: true
            },

            pointsEnabled: {
                type: Boolean,
                default: true
            },

            streakEnabled: {
                type: Boolean,
                default: true
            },

            leaderboardEnabled: {
                type: Boolean,
                default: true
            }
        }
    },
    {
        timestamps: true
    }
);

quizSessionSchema.index(
    { assessment: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: {
                $in: [
                    QUIZ_SESSION_STATUS.WAITING,
                    QUIZ_SESSION_STATUS.LIVE,
                    QUIZ_SESSION_STATUS.PAUSED
                ]
            }
        }
    }
);

const QuizSession = mongoose.model(
    "QuizSession_CGPT",
    quizSessionSchema
);

export default QuizSession;