import mongoose from "mongoose";

import QuizSession from "../../models/Quiz/QuizSession.js";
import QuizAttempt from "../../models/Quiz/QuizAttempt.js";
import QuizResponse from "../../models/Quiz/QuizResponse.js";
import AssessmentQuestion from "../../models/AssessmentQuestion.js";

import AppError from "../../utils/AppError.js";

const getQuizResult = async ({
    sessionId,
    studentId
}) => {
    if (
        !mongoose.Types.ObjectId.isValid(sessionId) ||
        !mongoose.Types.ObjectId.isValid(studentId)
    ) {
        throw new AppError(
            "Invalid quiz result data",
            400
        );
    }

    /*
     * Find the quiz session and its assessment.
     */
    const session = await QuizSession.findById(sessionId)
        .select(
            "_id assessment status duration startedAt endedAt"
        )
        .populate(
            "assessment",
            "code title description duration"
        );

    if (!session) {
        throw new AppError(
            "Quiz session not found",
            404
        );
    }

    /*
     * Find the student's attempt for this session.
     */
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
     * A result is available only after the attempt
     * has been submitted or timed out.
     */
    if (
        attempt.status !== "SUBMITTED" &&
        attempt.status !== "TIMED_OUT"
    ) {
        throw new AppError(
            "Quiz attempt has not been completed yet",
            400
        );
    }

    /*
     * Count the total questions belonging to the
     * assessment.
     */
    const totalQuestions =
        await AssessmentQuestion.countDocuments({
            assessment: session.assessment._id
        });

    /*
     * Get all responses belonging to this attempt.
     *
     * QuizResponse is the source of truth for the
     * questions actually answered.
     */
    const responses = await QuizResponse.find({
        attempt: attempt._id
    })
        .select(
            "assessmentQuestion selectedAnswer isCorrect pointsEarned responseTimeMs answeredAt"
        )
        .populate(
            "assessmentQuestion",
            "order marks"
        )
        .lean();

    /*
     * Calculate response-based statistics.
     */
    const attemptedQuestions = responses.length;

    const correctAnswers = responses.filter(
        (response) => response.isCorrect
    ).length;

    const wrongAnswers =
        attemptedQuestions - correctAnswers;

    /*
     * totalPoints is maintained on QuizAttempt during
     * individual answer submission.
     */
    const totalPoints = attempt.totalPoints || 0;

    return {
        sessionId: session._id,

        assessment: session.assessment,

        attemptId: attempt._id,

        status: attempt.status,

        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,

        totalQuestions,
        attemptedQuestions,
        correctAnswers,
        wrongAnswers,

        totalPoints,

        currentStreak: attempt.currentStreak || 0,
        longestStreak: attempt.longestStreak || 0,

        responses
    };
};

export default getQuizResult;