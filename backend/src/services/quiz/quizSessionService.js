import mongoose from "mongoose";

import QuizSession from "../../models/Quiz/QuizSession.js";
import QuizAttempt from "../../models/Quiz/QuizAttempt.js";
import Assessment from "../../models/Assessment.js";
import User from "../../models/Users.js";

import AppError from "../../utils/AppError.js";

import { ASSESSMENT_STATUS } from "../../constants/assessmentStatus.js";
import { QUIZ_SESSION_STATUS } from "../../constants/quizSessionStatus.js";
import { QUIZ_SESSION_MODE } from "../../constants/quizSessionMode.js";

import generateJoinCode from "../../utils/generateJoinCode.js";

const ACTIVE_SESSION_STATUSES = [
    QUIZ_SESSION_STATUS.WAITING,
    QUIZ_SESSION_STATUS.LIVE,
    QUIZ_SESSION_STATUS.PAUSED
];

const createUniqueJoinCode = async () => {
    let joinCode;
    let exists = true;

    while (exists) {
        joinCode = generateJoinCode();
        exists = await QuizSession.exists({ joinCode });
    }

    return joinCode;
};

export const createQuizSession = async ({
    assessmentId,
    hostId,
    mode = QUIZ_SESSION_MODE.STUDENT_PACED,
    maxParticipants = 60
}) => {
    if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
        throw new AppError("Invalid assessment ID", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(hostId)) {
        throw new AppError("Invalid host ID", 400);
    }

    const assessment = await Assessment.findById(assessmentId);

    if (!assessment) {
        throw new AppError("Assessment not found", 404);
    }

    if (assessment.status !== ASSESSMENT_STATUS.PUBLISHED) {
        throw new AppError(
            "Only published assessments can be hosted",
            400
        );
    }

    const host = await User.findById(hostId);

    if (!host) {
        throw new AppError("Quiz host not found", 404);
    }

    if (!["FACULTY", "ADMIN"].includes(host.role)) {
        throw new AppError("Only faculty can host a quiz", 403);
    }

    if (!Object.values(QUIZ_SESSION_MODE).includes(mode)) {
        throw new AppError("Invalid quiz session mode", 400);
    }

    if (
        !Number.isInteger(maxParticipants) ||
        maxParticipants < 1 ||
        maxParticipants > 500
    ) {
        throw new AppError(
            "Maximum participants must be between 1 and 500",
            400
        );
    }

    /*
     * ---------------------------------------------------------
     * Reuse an existing active session
     * ---------------------------------------------------------
     *
     * A published assessment can have only one active quiz
     * session at a time.
     *
     * This is important because the HostQuiz page calls
     * createQuizSession() whenever it is opened/refreshed.
     *
     * Therefore:
     *
     * WAITING -> return existing session
     * LIVE    -> return existing session
     * PAUSED  -> return existing session
     * ENDED   -> create a new session
     */
    const existingSession = await QuizSession.findOne({
        assessment: assessmentId,
        status: {
            $in: ACTIVE_SESSION_STATUSES
        }
    });

    if (existingSession) {
        /*
         * If another faculty member tries to host the same
         * assessment while an active session already exists,
         * do not give them control of that session.
         */
        if (
            existingSession.host.toString() !==
            hostId.toString()
        ) {
            throw new AppError(
                "This assessment already has an active quiz session hosted by another faculty member",
                409
            );
        }

        /*
         * Same host opening/refeshing the Host Quiz page.
         * Return the existing session instead of creating
         * another one.
         */
        return existingSession;
    }

    /*
     * No active session exists.
     *
     * Therefore a new session can be created.
     */
    const joinCode = await createUniqueJoinCode();

    const session = await QuizSession.create({
        assessment: assessmentId,
        host: hostId,
        joinCode,
        mode,
        maxParticipants,
        duration: assessment.duration,
        status: QUIZ_SESSION_STATUS.WAITING
    });

    return session;
};

export const getQuizSessionById = async ({
    sessionId,
    userId,
    userRole
}) => {
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        throw new AppError("Invalid quiz session ID", 400);
    }

    const session = await QuizSession.findById(sessionId)
        .populate(
            "assessment",
            "code title description duration"
        )
        .populate(
            "host",
            "name email role"
        );

    if (!session) {
        throw new AppError("Quiz session not found", 404);
    }

    const participantCount = await QuizAttempt.countDocuments({
        session: session._id
    });

    const sessionData = session.toObject();

    sessionData.participantCount = participantCount;

    /*
     * Include the student's attempt when the requester
     * is a student.
     */
    if (userRole === "STUDENT") {
        const studentAttempt = await QuizAttempt.findOne({
            session: session._id,
            student: userId
        }).select(
            "_id status startedAt submittedAt currentQuestion attemptedQuestions correctAnswers totalPoints currentStreak longestStreak"
        );

        sessionData.studentAttempt = studentAttempt;
    }

    return sessionData;
};

export const joinQuizSession = async ({
    joinCode,
    studentId
}) => {
    if (!joinCode) {
        throw new AppError(
            "Quiz join code is required",
            400
        );
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new AppError(
            "Invalid student ID",
            400
        );
    }

    const session = await QuizSession.findOne({
        joinCode: joinCode.toUpperCase().trim()
    });

    if (!session) {
        throw new AppError(
            "Quiz session not found",
            404
        );
    }

    if (session.status !== QUIZ_SESSION_STATUS.WAITING) {
        throw new AppError(
            "This quiz is no longer accepting participants",
            400
        );
    }

    const student = await User.findById(studentId);

    if (!student) {
        throw new AppError(
            "Student not found",
            404
        );
    }

    if (student.role !== "STUDENT") {
        throw new AppError(
            "Only students can join a quiz",
            403
        );
    }

    /*
     * If the student has already joined this session,
     * return the existing attempt.
     *
     * This also makes refresh/re-entry safe.
     */
    const existingAttempt = await QuizAttempt.findOne({
        session: session._id,
        student: studentId
    });

    if (existingAttempt) {
        return existingAttempt;
    }

    const participantCount = await QuizAttempt.countDocuments({
        session: session._id
    });

    if (participantCount >= session.maxParticipants) {
        throw new AppError(
            "This quiz has reached its participant limit",
            400
        );
    }

    const attempt = await QuizAttempt.create({
        session: session._id,
        assessment: session.assessment,
        student: studentId
    });

    return attempt;
};

export const startQuizSession = async ({
    sessionId,
    hostId
}) => {
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        throw new AppError(
            "Invalid quiz session ID",
            400
        );
    }

    if (!mongoose.Types.ObjectId.isValid(hostId)) {
        throw new AppError(
            "Invalid host ID",
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

    if (
        session.host.toString() !==
        hostId.toString()
    ) {
        throw new AppError(
            "You are not authorized to start this quiz",
            403
        );
    }

    if (
        session.status !==
        QUIZ_SESSION_STATUS.WAITING
    ) {
        throw new AppError(
            "Only waiting sessions can be started",
            400
        );
    }

    const startedAt = new Date();

    session.status = QUIZ_SESSION_STATUS.LIVE;
    session.startedAt = startedAt;

    await session.save();

    /*
     * All students who joined the waiting room
     * move into IN_PROGRESS when the quiz starts.
     */
    await QuizAttempt.updateMany(
        {
            session: session._id,
            status: "JOINED"
        },
        {
            $set: {
                status: "IN_PROGRESS",
                startedAt
            }
        }
    );

    return session;
};

export const endQuizSession = async ({
    sessionId,
    hostId
}) => {
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        throw new AppError(
            "Invalid quiz session ID",
            400
        );
    }

    if (!mongoose.Types.ObjectId.isValid(hostId)) {
        throw new AppError(
            "Invalid host ID",
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

    if (
        session.host.toString() !==
        hostId.toString()
    ) {
        throw new AppError(
            "You are not authorized to end this quiz",
            403
        );
    }

    if (
        session.status ===
        QUIZ_SESSION_STATUS.ENDED
    ) {
        throw new AppError(
            "Quiz session is already ended",
            400
        );
    }

    const endedAt = new Date();

    session.status = QUIZ_SESSION_STATUS.ENDED;
    session.endedAt = endedAt;

    await session.save();

    /*
     * Students who have not submitted are timed out.
     */
    await QuizAttempt.updateMany(
        {
            session: session._id,
            status: {
                $in: [
                    "JOINED",
                    "IN_PROGRESS"
                ]
            }
        },
        {
            $set: {
                status: "TIMED_OUT",
                submittedAt: endedAt
            }
        }
    );

    return session;
};