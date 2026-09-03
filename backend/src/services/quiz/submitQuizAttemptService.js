import mongoose from "mongoose";

import QuizSession from "../../models/Quiz/QuizSession.js";
import QuizAttempt from "../../models/Quiz/QuizAttempt.js";
import QuizResponse from "../../models/Quiz/QuizResponse.js";

import { QUIZ_SESSION_STATUS } from "../../constants/quizSessionStatus.js";

import AppError from "../../utils/AppError.js";

const submitQuizAttempt = async ({
    sessionId,
    studentId
}) => {
    if (
        !mongoose.Types.ObjectId.isValid(sessionId) ||
        !mongoose.Types.ObjectId.isValid(studentId)
    ) {
        throw new AppError(
            "Invalid quiz submission data",
            400
        );
    }

    const session = await QuizSession.findById(sessionId);

    if (!session) {
        throw new AppError(
            "Quiz session not found",
            404
        );
    }

    /*
     * A student can submit while the quiz is LIVE.
     *
     * If the session has already ended, the student should
     * not be able to submit an attempt manually.
     */
    if (session.status !== QUIZ_SESSION_STATUS.LIVE) {
        throw new AppError(
            "Quiz is no longer accepting submissions",
            400
        );
    }

    const attempt = await QuizAttempt.findOne({
        session: sessionId,
        student: studentId
    });

    if (!attempt) {
        throw new AppError(
            "Quiz attempt not found",
            404
        );
    }

    if (attempt.status === "SUBMITTED") {
        throw new AppError(
            "Quiz attempt has already been submitted",
            409
        );
    }

    if (attempt.status === "TIMED_OUT") {
        throw new AppError(
            "Quiz attempt has timed out",
            400
        );
    }

    if (attempt.status !== "IN_PROGRESS") {
        throw new AppError(
            "Quiz attempt is not active",
            400
        );
    }

    /*
     * Server-authoritative duration check.
     */
    if (!session.startedAt) {
        throw new AppError(
            "Quiz start time is not available",
            400
        );
    }

    const deadline =
        session.startedAt.getTime() +
        session.duration * 60 * 1000;

    if (Date.now() > deadline) {
        const timedOutAttempt =
            await QuizAttempt.findOneAndUpdate(
                {
                    _id: attempt._id,
                    status: "IN_PROGRESS"
                },
                {
                    $set: {
                        status: "TIMED_OUT",
                        submittedAt: new Date()
                    }
                },
                {
                    returnDocument:"after"
                }
            );

        throw new AppError(
            "Quiz time has expired",
            400
        );
    }

    /*
     * Mark the attempt as submitted.
     *
     * The conditional status check prevents two simultaneous
     * requests from both successfully submitting the attempt.
     */
    const submittedAt = new Date();

    const updatedAttempt =
        await QuizAttempt.findOneAndUpdate(
            {
                _id: attempt._id,
                status: "IN_PROGRESS"
            },
            {
                $set: {
                    status: "SUBMITTED",
                    submittedAt
                }
            },
            {
                returnDocument:"after"
            }
        );

    if (!updatedAttempt) {
        throw new AppError(
            "Quiz attempt was already submitted",
            409
        );
    }

    /*
     * Get the final response count directly from QuizResponse.
     * This gives us a reliable final attempted-question count.
     */
    const attemptedQuestions =
        await QuizResponse.countDocuments({
            attempt: updatedAttempt._id
        });

    const correctAnswers =
        await QuizResponse.countDocuments({
            attempt: updatedAttempt._id,
            isCorrect: true
        });

    /*
     * totalPoints/currentStreak/longestStreak are already
     * maintained on QuizAttempt during answer submission.
     */
    return {
        attemptId: updatedAttempt._id,
        status: updatedAttempt.status,
        submittedAt: updatedAttempt.submittedAt,
        totalQuestions: null,
        attemptedQuestions,
        correctAnswers,
        totalPoints: updatedAttempt.totalPoints,
        currentStreak: updatedAttempt.currentStreak,
        longestStreak: updatedAttempt.longestStreak
    };
};

export default submitQuizAttempt;