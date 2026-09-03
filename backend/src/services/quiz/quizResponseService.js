import mongoose from "mongoose";
import QuizResponse from "../../models/Quiz/QuizResponse.js";

import QuizAttempt from "../../models/Quiz/QuizAttempt.js";
import QuizSession from "../../models/Quiz/QuizSession.js";

import AssessmentQuestion from "../../models/AssessmentQuestion.js";
import { QUIZ_SESSION_STATUS } from "../../constants/quizSessionStatus.js";

import AppError from "../../utils/AppError.js";

const submitQuizResponse = async ({
    sessionId,
    attemptId,
    assessmentQuestionId,
    studentId,
    selectedAnswer,
    responseTimeMs
}) => {
    if (
        !mongoose.Types.ObjectId.isValid(sessionId) ||
        !mongoose.Types.ObjectId.isValid(attemptId) ||
        !mongoose.Types.ObjectId.isValid(assessmentQuestionId) ||
        !mongoose.Types.ObjectId.isValid(studentId)
    ) {
        throw new AppError("Invalid quiz response data", 400);
    }

    if (!selectedAnswer) {
        throw new AppError("Selected answer is required", 400);
    }

    const session = await QuizSession.findById(sessionId);

    if (!session) {
        throw new AppError("Quiz session not found", 404);
    }

    if (session.status !== QUIZ_SESSION_STATUS.LIVE) {
        throw new AppError(
            "Quiz is not currently accepting answers",
            400
        );
    }

    if (!session.startedAt) {
        throw new AppError("Quiz start time is not available", 400);
    }

    /*
     * Server-authoritative quiz duration check.
     *
     * The student cannot extend the quiz simply by keeping
     * the browser open or manipulating client-side timers.
     */
    const deadline =
        session.startedAt.getTime() +
        session.duration * 60 * 1000;

    if (Date.now() > deadline) {
        await QuizAttempt.updateOne(
            {
                _id: attemptId,
                session: sessionId,
                student: studentId,
                status: "IN_PROGRESS"
            },
            {
                $set: {
                    status: "TIMED_OUT",
                    submittedAt: new Date()
                }
            }
        );

        throw new AppError("Quiz time has expired", 400);
    }

    const attempt = await QuizAttempt.findOne({
        _id: attemptId,
        session: sessionId,
        student: studentId
    });

    if (!attempt) {
        throw new AppError("Quiz attempt not found", 404);
    }

    if (attempt.status !== "IN_PROGRESS") {
        throw new AppError(
            "This quiz attempt is no longer active",
            400
        );
    }

    /*
     * Load the assessment question together with the actual
     * Question document because correctAnswer is required
     * for server-side evaluation.
     */
    const assessmentQuestion = await AssessmentQuestion.findOne({
        _id: assessmentQuestionId,
        assessment: attempt.assessment
    }).populate("question");

    if (!assessmentQuestion) {
        throw new AppError(
            "Assessment question not found",
            404
        );
    }

    if (!assessmentQuestion.question) {
        throw new AppError(
            "Question data is not available",
            400
        );
    }

    /*
     * Make sure the question belongs to the current session's
     * assessment.
     */
    if (
        session.assessment.toString() !==
        assessmentQuestion.assessment.toString()
    ) {
        throw new AppError(
            "Question does not belong to this quiz",
            400
        );
    }

    /*
     * Prevent duplicate submissions for the same question.
     */
    const existingResponse = await QuizResponse.findOne({
        attempt: attemptId,
        assessmentQuestion: assessmentQuestionId
    });

    if (existingResponse) {
        throw new AppError(
            "This question has already been answered",
            409
        );
    }

    const normalizedAnswer = String(selectedAnswer)
        .trim()
        .toUpperCase();

    /*
     * Verify that the selected option actually exists
     * in the question.
     */
    const selectedOption = assessmentQuestion.question.options?.find(
        option => option.key === normalizedAnswer
    );

    if (!selectedOption) {
        throw new AppError(
            "Invalid answer option",
            400
        );
    }

    /*
     * IMPORTANT:
     * Correctness is determined on the server.
     *
     * The client never sends isCorrect or pointsEarned.
     */
    const isCorrect =
        assessmentQuestion.question.correctAnswer ===
        normalizedAnswer;

    const pointsEarned = isCorrect
        ? assessmentQuestion.marks
        : 0;

    /*
     * MVP streak calculation:
     *
     * Correct answer  -> increment streak
     * Wrong answer    -> reset streak
     */
    const currentStreak = isCorrect
        ? attempt.currentStreak + 1
        : 0;

    const longestStreak = Math.max(
        attempt.longestStreak,
        currentStreak
    );

    const response = await QuizResponse.create({
        session: sessionId,
        attempt: attemptId,
        assessmentQuestion: assessmentQuestionId,
        selectedAnswer: normalizedAnswer,
        isCorrect,
        pointsEarned,
        responseTimeMs:
            typeof responseTimeMs === "number" &&
            responseTimeMs >= 0
                ? responseTimeMs
                : undefined,
        answeredAt: new Date()
    });

    /*
     * Update the student's aggregate quiz statistics.
     */
    await QuizAttempt.updateOne(
        { _id: attemptId },
        {
            $inc: {
                attemptedQuestions: 1,
                correctAnswers: isCorrect ? 1 : 0,
                totalPoints: pointsEarned
            },
            $set: {
                currentStreak,
                longestStreak
            }
        }
    );

    return {
        responseId: response._id,
        assessmentQuestionId,
        isCorrect,
        pointsEarned,
        currentStreak,
        longestStreak
    };
};

export default submitQuizResponse;