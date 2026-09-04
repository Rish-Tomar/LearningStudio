import QuizSession from "../../models/Quiz/QuizSession.js";
import QuizAttempt from "../../models/Quiz/QuizAttempt.js";

const getQuizLeaderboardService = async ({
    sessionId,
    userId,
    userRole
}) => {

    const session = await QuizSession.findById(
        sessionId
    ).select(
        "_id assessment host status"
    );

    if (!session) {
        const error = new Error(
            "Quiz session not found"
        );
        error.statusCode = 404;
        throw error;
    }

    /*
     * ---------------------------------------------------------
     * ACCESS CONTROL
     * ---------------------------------------------------------
     *
     * Faculty/Admin:
     * Only the host of this session can see the leaderboard.
     *
     * Student:
     * Student must have joined this session.
     */

    if (
        userRole === "FACULTY" ||
        userRole === "ADMIN"
    ) {

        if (
            String(session.host) !==
            String(userId)
        ) {
            const error = new Error(
                "You are not authorized to view this leaderboard"
            );
            error.statusCode = 403;
            throw error;
        }

    } else if (userRole === "STUDENT") {

        const studentAttempt =
            await QuizAttempt.findOne({
                session: session._id,
                student: userId
            }).select("_id");

        if (!studentAttempt) {
            const error = new Error(
                "You have not joined this quiz"
            );
            error.statusCode = 403;
            throw error;
        }

    } else {

        const error = new Error(
            "You are not authorized to view this leaderboard"
        );
        error.statusCode = 403;
        throw error;

    }


    /*
     * ---------------------------------------------------------
     * GET PARTICIPANTS
     * ---------------------------------------------------------
     *
     * Every QuizAttempt represents one participant.
     *
     * We intentionally do not calculate rank from the
     * student's browser. The database is the source of truth.
     */

    const attempts =
        await QuizAttempt.find({
            session: session._id
        })
            .populate(
                "student",
                "name"
            )
            .select(
                "_id student status attemptedQuestions correctAnswers totalPoints currentStreak longestStreak submittedAt updatedAt"
            )
            .lean();


    /*
     * ---------------------------------------------------------
     * SORT
     * ---------------------------------------------------------
     *
     * Primary:
     *   Higher points first
     *
     * Secondary:
     *   More correct answers first
     *
     * Tertiary:
     *   More attempted questions first
     *
     * Then:
     *   Longer streak first
     *
     * Finally:
     *   Earlier update time
     *
     * The final _id comparison guarantees deterministic ordering
     * even when all other values are identical.
     */

    attempts.sort(
        (a, b) => {

            if (
                b.totalPoints !==
                a.totalPoints
            ) {
                return (
                    b.totalPoints -
                    a.totalPoints
                );
            }

            if (
                b.correctAnswers !==
                a.correctAnswers
            ) {
                return (
                    b.correctAnswers -
                    a.correctAnswers
                );
            }

            if (
                b.attemptedQuestions !==
                a.attemptedQuestions
            ) {
                return (
                    b.attemptedQuestions -
                    a.attemptedQuestions
                );
            }

            if (
                b.longestStreak !==
                a.longestStreak
            ) {
                return (
                    b.longestStreak -
                    a.longestStreak
                );
            }

            const aTime =
                new Date(
                    a.submittedAt ||
                    a.updatedAt
                ).getTime();

            const bTime =
                new Date(
                    b.submittedAt ||
                    b.updatedAt
                ).getTime();

            if (aTime !== bTime) {
                return aTime - bTime;
            }

            return String(a._id).localeCompare(
                String(b._id)
            );

        }
    );


    /*
     * ---------------------------------------------------------
     * BUILD LEADERBOARD
     * ---------------------------------------------------------
     *
     * We use sequential ranking:
     *
     * 1
     * 2
     * 3
     *
     * The tie-breakers above ensure deterministic positions.
     */

    const leaderboard =
        attempts.map(
            (attempt, index) => ({
                rank: index + 1,

                attemptId:
                    attempt._id,

                student: {
                    _id:
                        attempt.student?._id,

                    name:
                        attempt.student?.name ||
                        "Student"
                },

                status:
                    attempt.status,

                attemptedQuestions:
                    attempt.attemptedQuestions ||
                    0,

                correctAnswers:
                    attempt.correctAnswers ||
                    0,

                totalPoints:
                    attempt.totalPoints ||
                    0,

                currentStreak:
                    attempt.currentStreak ||
                    0,

                longestStreak:
                    attempt.longestStreak ||
                    0,

                submittedAt:
                    attempt.submittedAt ||
                    null
            })
        );


    /*
     * ---------------------------------------------------------
     * CURRENT STUDENT
     * ---------------------------------------------------------
     */

    let currentStudent = null;

    if (userRole === "STUDENT") {

        currentStudent =
            leaderboard.find(
                (entry) =>
                    String(
                        entry.student._id
                    ) === String(userId)
            ) || null;

    }


    return {
        sessionId: session._id,

        status:
            session.status,

        totalParticipants:
            leaderboard.length,

        leaderboard,

        currentStudent
    };

};

export default getQuizLeaderboardService;