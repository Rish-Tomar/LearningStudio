import mongoose from "mongoose";

import QuizSession from "../../models/Quiz/QuizSession.js";
import QuizAttempt from "../../models/Quiz/QuizAttempt.js";
import QuizResponse from "../../models/Quiz/QuizResponse.js";

import { QUIZ_SESSION_STATUS } from "../../constants/quizSessionStatus.js";

import AppError from "../../utils/AppError.js";

const buildAttemptResult = async (attempt) => {
    const attemptedQuestions =
        await QuizResponse.countDocuments({
            attempt: attempt._id
        });

    const correctAnswers =
        await QuizResponse.countDocuments({
            attempt: attempt._id,
            isCorrect: true
        });

    return {
        attemptId: attempt._id,
        status: attempt.status,
        submittedAt: attempt.submittedAt,
        totalQuestions: null,
        attemptedQuestions,
        correctAnswers,
        totalPoints: attempt.totalPoints,
        currentStreak: attempt.currentStreak,
        longestStreak: attempt.longestStreak
    };
};

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

    const attempt = await QuizAttempt.findOne({
        session: session._id,
        student: studentId
    });

    if (!attempt) {
        throw new AppError(
            "Quiz attempt not found",
            404
        );
    }

    /*
     * Idempotent submission.
     *
     * If the student has already submitted the quiz,
     * return the existing final result instead of
     * treating the request as an error.
     *
     * This protects against:
     * - double-clicking Submit
     * - browser retries
     * - network retries
     * - duplicate frontend requests
     */
    if (attempt.status === "SUBMITTED") {
        return buildAttemptResult(attempt);
    }

    /*
     * If the attempt has already timed out, return
     * its final state.
     */
    if (attempt.status === "TIMED_OUT") {
        return buildAttemptResult(attempt);
    }

    /*
     * Only an active attempt can be submitted.
     */
    if (attempt.status !== "IN_PROGRESS") {
        throw new AppError(
            "Quiz attempt is not active",
            400
        );
    }

    /*
     * The session must have a valid start time because
     * the server uses it to determine the deadline.
     */
    if (!session.startedAt) {
        throw new AppError(
            "Quiz start time is not available",
            400
        );
    }

    /*
     * Server-authoritative deadline.
     *
     * The student cannot extend the quiz by changing
     * the client-side timer.
     */
    const deadline =
        session.startedAt.getTime() +
        session.duration * 60 * 1000;

    const now = Date.now();

    /*
     * If the deadline has passed, atomically change
     * the attempt to TIMED_OUT.
     */
    if (now >= deadline) {
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
                    returnDocument: "after"
                }
            );

        /*
         * Another request may have changed the attempt
         * between our initial lookup and this update.
         *
         * Fetch the latest state and return it.
         */
        if (!timedOutAttempt) {
            const latestAttempt =
                await QuizAttempt.findById(attempt._id);

            if (!latestAttempt) {
                throw new AppError(
                    "Quiz attempt not found",
                    404
                );
            }

            return buildAttemptResult(latestAttempt);
        }

        return buildAttemptResult(timedOutAttempt);
    }

    /*
     * The session should normally still be LIVE when
     * a student submits manually.
     *
     * If the faculty has ended the session, endQuizSession()
     * should already have changed active attempts to TIMED_OUT.
     */
    if (session.status !== QUIZ_SESSION_STATUS.LIVE) {
        throw new AppError(
            "Quiz is no longer accepting submissions",
            400
        );
    }

    /*
     * Atomically transition:
     *
     * IN_PROGRESS → SUBMITTED
     *
     * The status condition prevents two simultaneous
     * requests from both successfully submitting.
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
                returnDocument: "after"
            }
        );

    /*
     * Another request may have submitted or timed out
     * the attempt between our previous lookup and this
     * atomic update.
     */
    if (!updatedAttempt) {
        const latestAttempt =
            await QuizAttempt.findById(attempt._id);

        if (!latestAttempt) {
            throw new AppError(
                "Quiz attempt not found",
                404
            );
        }

        return buildAttemptResult(latestAttempt);
    }

    /*
     * QuizResponse is the source of truth for the number
     * of questions actually answered.
     */
    return buildAttemptResult(updatedAttempt);
};

export default submitQuizAttempt;