import mongoose from "mongoose";

import QuizSession from "../../models/Quiz/QuizSession.js";
import QuizAttempt from "../../models/Quiz/QuizAttempt.js";

import AppError from "../../utils/AppError.js";

import { QUIZ_SESSION_STATUS } from "../../constants/quizSessionStatus.js";

const getCompletedQuizSessions = async ({
    hostId
}) => {
    if (!mongoose.Types.ObjectId.isValid(hostId)) {
        throw new AppError(
            "Invalid faculty ID",
            400
        );
    }

    const sessions = await QuizSession.find({
        host: hostId,
        status: QUIZ_SESSION_STATUS.ENDED
    })
        .populate(
            "assessment",
            "code title description duration"
        )
        .sort({
            endedAt: -1,
            createdAt: -1
        })
        .lean();

    const sessionIds = sessions.map(
        (session) => session._id
    );

    const participantCounts =
        await QuizAttempt.aggregate([
            {
                $match: {
                    session: {
                        $in: sessionIds
                    }
                }
            },
            {
                $group: {
                    _id: "$session",
                    participantCount: {
                        $sum: 1
                    },
                    submittedCount: {
                        $sum: {
                            $cond: [
                                {
                                    $in: [
                                        "$status",
                                        [
                                            "SUBMITTED",
                                            "TIMED_OUT"
                                        ]
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

    const countMap = new Map(
        participantCounts.map((item) => [
            String(item._id),
            item
        ])
    );

    return sessions.map((session) => {
        const counts =
            countMap.get(
                String(session._id)
            ) || {
                participantCount: 0,
                submittedCount: 0
            };

        return {
            _id: session._id,
            joinCode: session.joinCode,
            mode: session.mode,
            status: session.status,
            duration: session.duration,
            startedAt: session.startedAt,
            endedAt: session.endedAt,
            createdAt: session.createdAt,

            assessment: session.assessment,

            participantCount:
                counts.participantCount,

            submittedCount:
                counts.submittedCount
        };
    });
};

export default getCompletedQuizSessions;