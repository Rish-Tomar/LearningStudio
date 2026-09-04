import mongoose from "mongoose";

import QuizResponse from "../../models/Quiz/QuizResponse.js";
import QuizAttempt from "../../models/Quiz/QuizAttempt.js";
import QuizSession from "../../models/Quiz/QuizSession.js";
import AssessmentQuestion from "../../models/AssessmentQuestion.js";

import { QUIZ_SESSION_STATUS } from "../../constants/quizSessionStatus.js";

import AppError from "../../utils/AppError.js";


const submitQuizResponseService = async ({
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
        throw new AppError(
            "Invalid quiz response data",
            400
        );
    }


    if (
        typeof selectedAnswer !== "string" ||
        !selectedAnswer.trim()
    ) {
        throw new AppError(
            "Selected answer is required",
            400
        );
    }


    if (
        responseTimeMs !== undefined &&
        responseTimeMs !== null &&
        (
            typeof responseTimeMs !== "number" ||
            !Number.isFinite(responseTimeMs) ||
            responseTimeMs < 0
        )
    ) {
        throw new AppError(
            "Invalid response time",
            400
        );
    }


    const session =
        await QuizSession.findById(sessionId);


    if (!session) {
        throw new AppError(
            "Quiz session not found",
            404
        );
    }


    if (
        session.status !==
        QUIZ_SESSION_STATUS.LIVE
    ) {
        throw new AppError(
            "Quiz is not currently accepting answers",
            400
        );
    }


    if (!session.startedAt) {
        throw new AppError(
            "Quiz start time is not available",
            400
        );
    }


    /*
     * ---------------------------------------------------------
     * Server-authoritative timeout check
     * ---------------------------------------------------------
     */

    const deadline =
        session.startedAt.getTime() +
        session.duration * 60 * 1000;


    const now = new Date();


    if (now.getTime() >= deadline) {

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
                    submittedAt: now
                }
            }
        );


        throw new AppError(
            "Quiz time has expired",
            400
        );
    }


    /*
     * ---------------------------------------------------------
     * Find and validate attempt
     * ---------------------------------------------------------
     */

    const attempt =
        await QuizAttempt.findOne({
            _id: attemptId,
            session: sessionId,
            student: studentId
        });


    if (!attempt) {
        throw new AppError(
            "Quiz attempt not found",
            404
        );
    }


    if (attempt.status !== "IN_PROGRESS") {
        throw new AppError(
            "This quiz attempt is no longer active",
            400
        );
    }


    /*
     * ---------------------------------------------------------
     * Load assessment question and actual question
     * ---------------------------------------------------------
     */

    const assessmentQuestion =
        await AssessmentQuestion.findOne({
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
     * Make absolutely sure the question belongs
     * to the current quiz session.
     */

    if (
        String(session.assessment) !==
        String(assessmentQuestion.assessment)
    ) {
        throw new AppError(
            "Question does not belong to this quiz",
            400
        );
    }


    /*
     * ---------------------------------------------------------
     * Normalize selected answer
     * ---------------------------------------------------------
     */

    const normalizedAnswer =
        String(selectedAnswer)
            .trim()
            .toUpperCase();


    /*
     * ---------------------------------------------------------
     * Validate that selected option exists
     * ---------------------------------------------------------
     */

    const selectedOption =
        assessmentQuestion.question.options?.find(
            option =>
                option.key === normalizedAnswer
        );


    if (!selectedOption) {
        throw new AppError(
            "Invalid answer option",
            400
        );
    }


    /*
     * ---------------------------------------------------------
     * Server-side correctness evaluation
     * ---------------------------------------------------------
     */

    const normalizedCorrectAnswer =
        String(
            assessmentQuestion.question.correctAnswer || ""
        )
            .trim()
            .toUpperCase();


    const isCorrect =
        normalizedCorrectAnswer ===
        normalizedAnswer;


    /*
     * ---------------------------------------------------------
     * Calculate points
     *
     * MVP:
     * Correct = assessment question marks
     * Wrong   = 0
     * ---------------------------------------------------------
     */

    const pointsEarned =
        isCorrect
            ? assessmentQuestion.marks
            : 0;


    /*
     * ---------------------------------------------------------
     * Calculate streak
     * ---------------------------------------------------------
     */

    const previousStreak =
        attempt.currentStreak || 0;


    const currentStreak =
        isCorrect
            ? previousStreak + 1
            : 0;


    const longestStreak =
        Math.max(
            attempt.longestStreak || 0,
            currentStreak
        );


    /*
     * ---------------------------------------------------------
     * MongoDB transaction
     *
     * QuizResponse creation and QuizAttempt statistics
     * must succeed together.
     * ---------------------------------------------------------
     */

    const mongoSession =
        await mongoose.startSession();


    try {

        let response;


        await mongoSession.withTransaction(
            async () => {

                /*
                 * Create response.
                 *
                 * The unique index on:
                 *
                 * { attempt, assessmentQuestion }
                 *
                 * protects against simultaneous duplicate
                 * submissions.
                 */

                response =
                    await QuizResponse.create(
                        [
                            {
                                session: sessionId,
                                attempt: attemptId,
                                assessmentQuestion:
                                    assessmentQuestionId,
                                selectedAnswer:
                                    normalizedAnswer,
                                isCorrect,
                                pointsEarned,
                                responseTimeMs:
                                    responseTimeMs ??
                                    undefined,
                                answeredAt: now
                            }
                        ],
                        {
                            session:
                                mongoSession
                        }
                    );


                /*
                 * Update attempt statistics.
                 */

                await QuizAttempt.updateOne(
                    {
                        _id: attemptId,
                        status: "IN_PROGRESS"
                    },
                    {
                        $inc: {
                            attemptedQuestions: 1,
                            correctAnswers:
                                isCorrect ? 1 : 0,
                            totalPoints:
                                pointsEarned
                        },

                        $set: {
                            currentStreak,
                            longestStreak
                        }
                    },
                    {
                        session:
                            mongoSession
                    }
                );
            }
        );


        const createdResponse =
            response?.[0];


        if (!createdResponse) {
            throw new AppError(
                "Failed to save quiz response",
                500
            );
        }


        return {
            responseId:
                createdResponse._id,

            assessmentQuestionId,

            isCorrect,

            pointsEarned,

            currentStreak,

            longestStreak
        };

    } catch (error) {

        /*
         * MongoDB duplicate-key error.
         *
         * This can happen when two requests for the same
         * question arrive at almost exactly the same time.
         */

        if (error?.code === 11000) {
            throw new AppError(
                "This question has already been answered",
                409
            );
        }


        throw error;

    } finally {

        await mongoSession.endSession();

    }
};


export default submitQuizResponseService;