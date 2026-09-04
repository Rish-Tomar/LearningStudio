import asyncHandler from "../../utils/asyncHandler.js";

import {
    createQuizSession as createQuizSessionService,
    getQuizSessionById as getQuizSessionByIdService,
    joinQuizSession as joinQuizSessionService,
    startQuizSession as startQuizSessionService,
    endQuizSession as endQuizSessionService,
} from "../../services/quiz/quizSessionService.js";

import submitQuizResponseService from "../../services/quiz/quizResponseService.js";
import submitQuizAttemptService from "../../services/quiz/submitQuizAttemptService.js";
import getQuizLeaderboardService from "../../services/quiz/getQuizLeaderboardService.js";
import getQuizResult from "../../services/quiz/quizResultService.js";
import getCompletedQuizSessions from "../../services/quiz/quizSessionHistoryService.js";
export const createQuizSession = asyncHandler(
    async (req, res) => {

        const session =
            await createQuizSessionService({
                assessmentId: req.body.assessmentId,
                hostId: req.user._id,
                mode: req.body.mode,
                maxParticipants:
                    req.body.maxParticipants
            });

        res.status(201).json({
            success: true,
            message: "Quiz session created successfully",
            data: session
        });

    }
);

export const getQuizSessionById = asyncHandler(async (req, res) => {
    const session = await getQuizSessionByIdService({
        sessionId: req.params.id,
        userId: req.user._id,
        userRole: req.user.role
    });

    res.status(200).json({
        success: true,
        data: session
    });
});

export const joinQuizSession = asyncHandler(
    async (req, res) => {

        const attempt =
            await joinQuizSessionService({
                joinCode: req.body.joinCode,
                studentId: req.user._id
            });

        res.status(200).json({
            success: true,
            message: "Joined quiz successfully",
            data: attempt
        });

    }
);

export const startQuizSession = asyncHandler(
    async (req, res) => {

        const session =
            await startQuizSessionService({
                sessionId: req.params.id,
                hostId: req.user._id
            });

        res.status(200).json({
            success: true,
            message: "Quiz session started",
            data: session
        });

    }
);

export const endQuizSession = asyncHandler(
    async (req, res) => {

        const session =
            await endQuizSessionService({
                sessionId: req.params.id,
                hostId: req.user._id
            });

        res.status(200).json({
            success: true,
            message: "Quiz session ended",
            data: session
        });

    }
);

export const submitQuizResponse = asyncHandler(async (req, res) => {
    const response = await submitQuizResponseService({
        sessionId: req.params.id,
        attemptId: req.body.attemptId,
        assessmentQuestionId: req.body.assessmentQuestionId,
        studentId: req.user._id,
        selectedAnswer: req.body.selectedAnswer,
        responseTimeMs: req.body.responseTimeMs
    });

    res.status(201).json({
        success: true,
        message: "Answer submitted successfully",
        data: response
    });
});

export const submitQuizAttempt = asyncHandler(async (req, res) => {
    const result = await submitQuizAttemptService({
        sessionId: req.params.id,
        studentId: req.user._id
    });

    res.status(200).json({
        success: true,
        message: "Quiz submitted successfully",
        data: result
    });
});

export const getQuizLeaderboard = asyncHandler(
    async (req, res) => {

        const result =
            await getQuizLeaderboardService({
                sessionId: req.params.id,
                userId: req.user._id,
                userRole: req.user.role
            });

        res.status(200).json({
            success: true,
            data: result
        });

    }
);

export const getQuizResultController = async (
    req,
    res,
    next
) => {
    try {
        const { id: sessionId } = req.params;

        const result = await getQuizResult({
            sessionId,
            studentId: req.user._id
        });

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getCompletedQuizSessionsController = async (
    req,
    res,
    next
) => {
    try {
        const sessions =
            await getCompletedQuizSessions({
                hostId: req.user._id
            });

        res.status(200).json({
            success: true,
            data: sessions
        });
    } catch (error) {
        next(error);
    }
};