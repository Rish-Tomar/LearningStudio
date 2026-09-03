import asyncHandler from "../../utils/asyncHandler.js";

import {
    createQuizSession as createQuizSessionService,
    getQuizSessionById as getQuizSessionByIdService,
    joinQuizSession as joinQuizSessionService,
    startQuizSession as startQuizSessionService,
    endQuizSession as endQuizSessionService
} from "../../services/quiz/quizSessionService.js";

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

export const getQuizSessionById = asyncHandler(
    async (req, res) => {

        const session =
            await getQuizSessionByIdService(
                req.params.id
            );

        res.status(200).json({
            success: true,
            data: session
        });

    }
);

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