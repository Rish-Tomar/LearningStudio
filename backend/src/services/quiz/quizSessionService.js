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

const createUniqueJoinCode = async () => {

    let joinCode;
    let exists = true;

    while (exists) {

        joinCode = generateJoinCode();

        exists = await QuizSession.exists({
            joinCode
        });

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
        throw new AppError(
            "Invalid assessment ID",
            400
        );
    }

    if (!mongoose.Types.ObjectId.isValid(hostId)) {
        throw new AppError(
            "Invalid host ID",
            400
        );
    }

    const assessment = await Assessment.findById(
        assessmentId
    );

    if (!assessment) {
        throw new AppError(
            "Assessment not found",
            404
        );
    }

    if (assessment.status !== ASSESSMENT_STATUS.PUBLISHED) {
        throw new AppError(
            "Only published assessments can be hosted",
            400
        );
    }

    const host = await User.findById(hostId);

    if (!host) {
        throw new AppError(
            "Quiz host not found",
            404
        );
    }

    if (!["FACULTY", "ADMIN"].includes(host.role)) {
        throw new AppError(
            "Only faculty can host a quiz",
            403
        );
    }

    if (
        !Object.values(QUIZ_SESSION_MODE).includes(mode)
    ) {
        throw new AppError(
            "Invalid quiz session mode",
            400
        );
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
        throw new AppError(
            "Quiz session not found",
            404
        );
    }

    const participantCount = await QuizAttempt.countDocuments({
        session: session._id
    });

    const sessionData = session.toObject();

    sessionData.participantCount = participantCount;

    /*
     * Only expose a student's own attempt.
     *
     * Faculty/Admin do not need a studentAttempt object.
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

    if (
        session.status !== QUIZ_SESSION_STATUS.WAITING
    ) {
        throw new AppError(
            "This quiz is no longer accepting participants",
            400
        );
    }

    const student = await User.findById(
        studentId
    );

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

    const existingAttempt =
        await QuizAttempt.findOne({
            session: session._id,
            student: studentId
        });

    if (existingAttempt) {
        return existingAttempt;
    }

    const participantCount =
        await QuizAttempt.countDocuments({
            session: session._id
        });

    if (
        participantCount >=
        session.maxParticipants
    ) {
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

    const session =
        await QuizSession.findById(sessionId);

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

    session.status =
        QUIZ_SESSION_STATUS.LIVE;

    session.startedAt = new Date();

    await session.save();

    await QuizAttempt.updateMany(
        {
            session: session._id,
            status: "JOINED"
        },
        {
            $set: {
                status: "IN_PROGRESS",
                startedAt: new Date()
            }
        }
    );

    return session;
};

export const endQuizSession = async ({
    sessionId,
    hostId
}) => {

    const session =
        await QuizSession.findById(sessionId);

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

    session.status =
        QUIZ_SESSION_STATUS.ENDED;

    session.endedAt = new Date();

    await session.save();

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
                submittedAt: new Date()
            }
        }
    );

    return session;
};