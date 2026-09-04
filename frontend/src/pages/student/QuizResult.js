import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import quizSessionService from "../../services/quizSessionService";

const QuizResult = () => {

    const navigate = useNavigate();
    const { sessionId } = useParams();

    const [session, setSession] = useState(null);
    const [attempt, setAttempt] = useState(null);

    const [leaderboardData, setLeaderboardData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [leaderboardLoading, setLeaderboardLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [leaderboardError, setLeaderboardError] =
        useState("");

    useEffect(() => {

        const loadResult = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await quizSessionService
                        .getQuizSessionById(sessionId);

                const sessionData =
                    response.data;

                setSession(sessionData);

                if (!sessionData.studentAttempt) {

                    throw new Error(
                        "Quiz attempt information is not available."
                    );

                }

                setAttempt(
                    sessionData.studentAttempt
                );

            } catch (error) {

                console.error(
                    "Failed to load quiz result:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load quiz result."
                );

            } finally {

                setLoading(false);

            }

        };

        if (sessionId) {
            loadResult();
        }

    }, [sessionId]);


    useEffect(() => {

        const loadLeaderboard = async () => {

            try {

                setLeaderboardLoading(true);
                setLeaderboardError("");

                const response =
                    await quizSessionService
                        .getQuizLeaderboard(sessionId);

                setLeaderboardData(
                    response.data
                );

            } catch (error) {

                console.error(
                    "Failed to load leaderboard:",
                    error
                );

                setLeaderboardError(
                    error.response?.data?.message ||
                    "Failed to load leaderboard."
                );

            } finally {

                setLeaderboardLoading(false);

            }

        };

        if (sessionId) {
            loadLeaderboard();
        }

    }, [sessionId]);


    if (loading) {

        return (
            <DashboardLayout>

                <Box
                    sx={{
                        minHeight: "60vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <CircularProgress />
                </Box>

            </DashboardLayout>
        );

    }


    if (error || !session || !attempt) {

        return (
            <DashboardLayout>

                <Box
                    sx={{
                        maxWidth: 900,
                        mx: "auto"
                    }}
                >

                    <Alert severity="error">
                        {error ||
                            "Quiz result could not be loaded."}
                    </Alert>

                    <Button
                        sx={{ mt: 2 }}
                        onClick={() =>
                            navigate(
                                "/student/quiz/join"
                            )
                        }
                    >
                        Back to Quiz
                    </Button>

                </Box>

            </DashboardLayout>
        );

    }


    const totalPoints =
        attempt.totalPoints || 0;

    const correctAnswers =
        attempt.correctAnswers || 0;

    const attemptedQuestions =
        attempt.attemptedQuestions || 0;

    const currentStreak =
        attempt.currentStreak || 0;

    const longestStreak =
        attempt.longestStreak || 0;

    const accuracy =
        attemptedQuestions > 0
            ? Math.round(
                  (correctAnswers /
                      attemptedQuestions) *
                      100
              )
            : 0;

    const currentStudent =
        leaderboardData?.currentStudent;

    const leaderboard =
        leaderboardData?.leaderboard || [];

    const topTen =
        leaderboard.slice(0, 10);


    return (
        <DashboardLayout>

            <Box
                sx={{
                    maxWidth: 1000,
                    mx: "auto",
                    pb: 5
                }}
            >

                {/* Page Header */}

                <Box sx={{ mb: 3 }}>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Quiz Submitted!
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        {session.assessment?.title ||
                            "Quiz"}
                    </Typography>

                </Box>


                {/* Performance Card */}

                <Card>

                    <CardContent
                        sx={{
                            p: {
                                xs: 2,
                                sm: 3
                            }
                        }}
                    >

                        <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{ mb: 3 }}
                        >
                            Your Performance
                        </Typography>


                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr 1fr",
                                    sm: "repeat(4, 1fr)"
                                },
                                gap: 2
                            }}
                        >

                            {/* Points */}

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    textAlign: "center"
                                }}
                            >

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                >
                                    {totalPoints}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Points
                                </Typography>

                            </Paper>


                            {/* Correct */}

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    textAlign: "center"
                                }}
                            >

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                >
                                    {correctAnswers}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Correct
                                </Typography>

                            </Paper>


                            {/* Attempted */}

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    textAlign: "center"
                                }}
                            >

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                >
                                    {attemptedQuestions}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Attempted
                                </Typography>

                            </Paper>


                            {/* Accuracy */}

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    textAlign: "center"
                                }}
                            >

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                >
                                    {accuracy}%
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Accuracy
                                </Typography>

                            </Paper>

                        </Box>

                    </CardContent>

                </Card>


                {/* Streak Performance */}

                <Card sx={{ mt: 3 }}>

                    <CardContent
                        sx={{
                            p: {
                                xs: 2,
                                sm: 3
                            }
                        }}
                    >

                        <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{ mb: 3 }}
                        >
                            Streak Performance
                        </Typography>


                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr 1fr",
                                    sm: "repeat(2, 1fr)"
                                },
                                gap: 2
                            }}
                        >

                            {/* Current Streak */}

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2.5,
                                    textAlign: "center"
                                }}
                            >

                                <Typography
                                    sx={{
                                        fontSize: 34,
                                        lineHeight: 1,
                                        mb: 1
                                    }}
                                >
                                    🔥
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                >
                                    {currentStreak}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Final Streak
                                </Typography>

                            </Paper>


                            {/* Longest Streak */}

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2.5,
                                    textAlign: "center"
                                }}
                            >

                                <Typography
                                    sx={{
                                        fontSize: 34,
                                        lineHeight: 1,
                                        mb: 1
                                    }}
                                >
                                    🏆
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                >
                                    {longestStreak}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Longest Streak
                                </Typography>

                            </Paper>

                        </Box>

                    </CardContent>

                </Card>


                {/* Success Message */}

                <Alert
                    severity="success"
                    sx={{ mt: 3 }}
                >
                    Your quiz attempt has been
                    successfully recorded.
                </Alert>


                {/* Leaderboard */}

                <Card sx={{ mt: 3 }}>

                    <CardContent
                        sx={{
                            p: {
                                xs: 2,
                                sm: 3
                            }
                        }}
                    >

                        <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{ mb: 3 }}
                        >
                            Leaderboard
                        </Typography>


                        {/* Loading */}

                        {leaderboardLoading && (

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    py: 5
                                }}
                            >
                                <CircularProgress />
                            </Box>

                        )}


                        {/* Error */}

                        {!leaderboardLoading &&
                            leaderboardError && (

                                <Alert severity="warning">
                                    {leaderboardError}
                                </Alert>

                            )}


                        {/* Leaderboard Content */}

                        {!leaderboardLoading &&
                            !leaderboardError &&
                            leaderboardData && (
                                <>

                                    {/* Your Ranking */}

                                    {currentStudent && (

                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 2.5,
                                                mb: 3,
                                                bgcolor:
                                                    "action.hover",
                                                borderColor:
                                                    "primary.main"
                                            }}
                                        >

                                            <Stack
                                                direction={{
                                                    xs: "column",
                                                    sm: "row"
                                                }}
                                                justifyContent="space-between"
                                                alignItems={{
                                                    xs: "flex-start",
                                                    sm: "center"
                                                }}
                                                spacing={2}
                                            >

                                                <Box>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Your Ranking
                                                    </Typography>

                                                    <Typography
                                                        variant="h3"
                                                        fontWeight={700}
                                                        sx={{
                                                            lineHeight: 1.1,
                                                            mt: 0.5
                                                        }}
                                                    >
                                                        #
                                                        {
                                                            currentStudent.rank
                                                        }
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ mt: 0.5 }}
                                                    >
                                                        of{" "}
                                                        {
                                                            leaderboardData.totalParticipants
                                                        }{" "}
                                                        students
                                                    </Typography>

                                                </Box>


                                                <Box
                                                    sx={{
                                                        textAlign: {
                                                            xs: "left",
                                                            sm: "right"
                                                        }
                                                    }}
                                                >

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Your Points
                                                    </Typography>

                                                    <Typography
                                                        variant="h4"
                                                        fontWeight={700}
                                                    >
                                                        {
                                                            currentStudent.totalPoints
                                                        }{" "}
                                                        pts
                                                    </Typography>

                                                </Box>

                                            </Stack>

                                        </Paper>

                                    )}


                                    {/* Rankings Heading */}

                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={700}
                                        sx={{ mb: 1.5 }}
                                    >
                                        Rankings
                                    </Typography>


                                    {/* Empty Leaderboard */}

                                    {topTen.length === 0 && (

                                        <Alert severity="info">
                                            No participants have
                                            completed the quiz yet.
                                        </Alert>

                                    )}


                                    {/* Ranking Entries */}

                                    <Stack spacing={1}>

                                        {topTen.map(
                                            (entry) => {

                                                const isCurrentStudent =
                                                    currentStudent &&
                                                    String(
                                                        currentStudent
                                                            .student?._id
                                                    ) ===
                                                        String(
                                                            entry.student?._id
                                                        );

                                                return (

                                                    <Paper
                                                        key={
                                                            entry.attemptId
                                                        }
                                                        variant="outlined"
                                                        sx={{
                                                            p: 1.5,
                                                            bgcolor:
                                                                isCurrentStudent
                                                                    ? "action.selected"
                                                                    : "background.paper",
                                                            borderColor:
                                                                isCurrentStudent
                                                                    ? "primary.main"
                                                                    : "divider",
                                                            borderWidth:
                                                                isCurrentStudent
                                                                    ? 2
                                                                    : 1
                                                        }}
                                                    >

                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            spacing={2}
                                                        >

                                                            {/* Rank */}

                                                            <Box
                                                                sx={{
                                                                    width: 45,
                                                                    flexShrink: 0,
                                                                    textAlign:
                                                                        "center"
                                                                }}
                                                            >

                                                                <Typography
                                                                    fontWeight={700}
                                                                >
                                                                    #
                                                                    {
                                                                        entry.rank
                                                                    }
                                                                </Typography>

                                                            </Box>


                                                            {/* Student */}

                                                            <Box
                                                                sx={{
                                                                    flex: 1,
                                                                    minWidth: 0
                                                                }}
                                                            >

                                                                <Typography
                                                                    fontWeight={
                                                                        isCurrentStudent
                                                                            ? 700
                                                                            : 600
                                                                    }
                                                                    noWrap
                                                                >

                                                                    {
                                                                        entry.student
                                                                            ?.name ||
                                                                        "Student"
                                                                    }

                                                                    {isCurrentStudent &&
                                                                        " (You)"}

                                                                </Typography>


                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                >

                                                                    {
                                                                        entry.correctAnswers
                                                                    }{" "}
                                                                    correct
                                                                    {" • "}
                                                                    {
                                                                        entry.attemptedQuestions
                                                                    }{" "}
                                                                    attempted

                                                                </Typography>

                                                            </Box>


                                                            {/* Points */}

                                                            <Box
                                                                sx={{
                                                                    textAlign:
                                                                        "right",
                                                                    flexShrink: 0
                                                                }}
                                                            >

                                                                <Typography
                                                                    fontWeight={700}
                                                                >

                                                                    {
                                                                        entry.totalPoints
                                                                    }{" "}
                                                                    pts

                                                                </Typography>


                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                >

                                                                    Streak{" "}
                                                                    {
                                                                        entry.longestStreak
                                                                    }

                                                                </Typography>

                                                            </Box>

                                                        </Stack>

                                                    </Paper>

                                                );

                                            }
                                        )}

                                    </Stack>


                                    {/* More Participants */}

                                    {leaderboardData.totalParticipants >
                                        10 && (

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                textAlign: "center",
                                                mt: 2
                                            }}
                                        >

                                            Showing top 10 of{" "}
                                            {
                                                leaderboardData.totalParticipants
                                            }{" "}
                                            participants

                                        </Typography>

                                    )}

                                </>
                            )}

                    </CardContent>

                </Card>


                {/* Bottom Action */}

                <Divider sx={{ mt: 4, mb: 3 }} />

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row"
                    }}
                    justifyContent="center"
                    spacing={2}
                >

                    <Button
                        variant="outlined"
                        onClick={() =>
                            navigate(
                                "/student/quiz/join"
                            )
                        }
                    >
                        Back to Quiz
                    </Button>

                </Stack>

            </Box>

        </DashboardLayout>
    );

};

export default QuizResult;