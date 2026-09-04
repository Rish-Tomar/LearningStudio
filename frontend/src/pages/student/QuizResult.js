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
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [result, setResult] = useState(null);
    const [leaderboardData, setLeaderboardData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [leaderboardLoading, setLeaderboardLoading] = useState(true);

    const [error, setError] = useState("");
    const [leaderboardError, setLeaderboardError] = useState("");

    useEffect(() => {
        const loadResult = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await quizSessionService.getQuizResult(
                        sessionId
                    );

                const resultData = response.data;

                setResult(resultData);
            } catch (err) {
                console.error(
                    "Failed to load quiz result:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                        err?.message ||
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
                    await quizSessionService.getQuizLeaderboard(
                        sessionId
                    );

                setLeaderboardData(response.data);
            } catch (err) {
                console.error(
                    "Failed to load leaderboard:",
                    err
                );

                setLeaderboardError(
                    err?.response?.data?.message ||
                        err?.message ||
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
                        minHeight: "70vh",
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

    if (error) {
        return (
            <DashboardLayout>
                <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
                    <Alert severity="error">
                        {error}
                    </Alert>

                    <Button
                        sx={{ mt: 2 }}
                        variant="contained"
                        onClick={() =>
                            navigate("/student/quiz/join")
                        }
                    >
                        Back to Quiz
                    </Button>
                </Box>
            </DashboardLayout>
        );
    }

    if (!result) {
        return (
            <DashboardLayout>
                <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
                    <Alert severity="warning">
                        Quiz result is not available.
                    </Alert>
                </Box>
            </DashboardLayout>
        );
    }

    const totalQuestions =
        result.totalQuestions || 0;

    const attemptedQuestions =
        result.attemptedQuestions || 0;

    const correctAnswers =
        result.correctAnswers || 0;

    const wrongAnswers =
        result.wrongAnswers || 0;

    const unansweredQuestions = Math.max(
        totalQuestions - attemptedQuestions,
        0
    );

    const totalPoints =
        result.totalPoints || 0;

    const accuracy =
        attemptedQuestions > 0
            ? Math.round(
                  (correctAnswers /
                      attemptedQuestions) *
                      100
              )
            : 0;

    const isTimedOut =
        result.status === "TIMED_OUT";

    const currentStudent =
        leaderboardData?.currentStudent;

    const leaderboard =
        leaderboardData?.leaderboard || [];

    return (
        <DashboardLayout>
            <Box
                sx={{
                    maxWidth: 1100,
                    mx: "auto",
                    py: 3
                }}
            >
                {/* Header */}
                <Stack spacing={1} sx={{ mb: 3 }}>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        {isTimedOut
                            ? "Quiz Time Expired"
                            : "Quiz Submitted!"}
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                    >
                        {result.assessment?.title ||
                            "Quiz Result"}
                    </Typography>
                </Stack>

                {/* Status message */}
                <Alert
                    severity={
                        isTimedOut
                            ? "warning"
                            : "success"
                    }
                    sx={{ mb: 3 }}
                >
                    {isTimedOut
                        ? "The quiz time expired. Your answers submitted before the deadline have been evaluated."
                        : "Your quiz has been submitted successfully."}
                </Alert>

                {/* Result Summary */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{ mb: 2 }}
                        >
                            Your Result
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

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
                                    {result.longestStreak ||
                                        0}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Best Streak
                                </Typography>
                            </Paper>
                        </Box>
                    </CardContent>
                </Card>

                {/* Question Statistics */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{ mb: 2 }}
                        >
                            Question Summary
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        <Stack spacing={2}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Typography>
                                    Total Questions
                                </Typography>

                                <Typography fontWeight={600}>
                                    {totalQuestions}
                                </Typography>
                            </Stack>

                            <Stack
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Typography>
                                    Attempted
                                </Typography>

                                <Typography fontWeight={600}>
                                    {attemptedQuestions}
                                </Typography>
                            </Stack>

                            <Stack
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Typography>
                                    Correct Answers
                                </Typography>

                                <Typography
                                    fontWeight={600}
                                    color="success.main"
                                >
                                    {correctAnswers}
                                </Typography>
                            </Stack>

                            <Stack
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Typography>
                                    Wrong Answers
                                </Typography>

                                <Typography
                                    fontWeight={600}
                                    color="error.main"
                                >
                                    {wrongAnswers}
                                </Typography>
                            </Stack>

                            <Stack
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Typography>
                                    Unanswered
                                </Typography>

                                <Typography
                                    fontWeight={600}
                                    color="text.secondary"
                                >
                                    {unansweredQuestions}
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Streak */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{ mb: 2 }}
                        >
                            Streak
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr 1fr",
                                    sm: "1fr 1fr"
                                },
                                gap: 2
                            }}
                        >
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
                                    {result.currentStreak ||
                                        0}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Current Streak
                                </Typography>
                            </Paper>

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
                                    {result.longestStreak ||
                                        0}
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

                {/* Leaderboard */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{ mb: 2 }}
                        >
                            Live Leaderboard
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        {leaderboardLoading ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "center",
                                    py: 4
                                }}
                            >
                                <CircularProgress
                                    size={28}
                                />
                            </Box>
                        ) : leaderboardError ? (
                            <Alert severity="error">
                                {leaderboardError}
                            </Alert>
                        ) : leaderboard.length ===
                          0 ? (
                            <Typography
                                color="text.secondary"
                                textAlign="center"
                                sx={{ py: 3 }}
                            >
                                Leaderboard is not
                                available.
                            </Typography>
                        ) : (
                            <Stack spacing={1}>
                                {leaderboard
                                    .slice(0, 10)
                                    .map(
                                        (
                                            entry
                                        ) => {
                                            const isCurrentStudent =
                                                currentStudent &&
                                                String(
                                                    entry
                                                        .student
                                                        ?._id
                                                ) ===
                                                    String(
                                                        currentStudent
                                                            .student
                                                            ?._id
                                                    );

                                            return (
                                                <Paper
                                                    key={
                                                        entry.attemptId
                                                    }
                                                    variant="outlined"
                                                    sx={{
                                                        p: 1.5,
                                                        backgroundColor:
                                                            isCurrentStudent
                                                                ? "action.selected"
                                                                : "transparent"
                                                    }}
                                                >
                                                    <Stack
                                                        direction={{
                                                            xs: "column",
                                                            sm: "row"
                                                        }}
                                                        spacing={1}
                                                        alignItems={{
                                                            xs: "flex-start",
                                                            sm: "center"
                                                        }}
                                                        justifyContent="space-between"
                                                    >
                                                        <Stack
                                                            direction="row"
                                                            spacing={
                                                                2
                                                            }
                                                            alignItems="center"
                                                        >
                                                            <Typography
                                                                fontWeight={
                                                                    700
                                                                }
                                                                sx={{
                                                                    minWidth: 35
                                                                }}
                                                            >
                                                                #
                                                                {
                                                                    entry.rank
                                                                }
                                                            </Typography>

                                                            <Box>
                                                                <Typography
                                                                    fontWeight={
                                                                        600
                                                                    }
                                                                >
                                                                    {entry
                                                                        .student
                                                                        ?.name ||
                                                                        "Student"}
                                                                    {isCurrentStudent &&
                                                                        " (You)"}
                                                                </Typography>

                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                >
                                                                    {
                                                                        entry.correctAnswers
                                                                    }
                                                                    /
                                                                    {
                                                                        entry.attemptedQuestions
                                                                    }{" "}
                                                                    correct
                                                                </Typography>
                                                            </Box>
                                                        </Stack>

                                                        <Stack
                                                            direction="row"
                                                            spacing={
                                                                3
                                                            }
                                                            alignItems="center"
                                                        >
                                                            <Box
                                                                sx={{
                                                                    textAlign:
                                                                        "right"
                                                                }}
                                                            >
                                                                <Typography
                                                                    fontWeight={
                                                                        700
                                                                    }
                                                                >
                                                                    {
                                                                        entry.totalPoints
                                                                    }
                                                                </Typography>

                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                >
                                                                    Points
                                                                </Typography>
                                                            </Box>

                                                            <Box
                                                                sx={{
                                                                    textAlign:
                                                                        "right"
                                                                }}
                                                            >
                                                                <Typography
                                                                    fontWeight={
                                                                        700
                                                                    }
                                                                >
                                                                    {
                                                                        entry.longestStreak
                                                                    }
                                                                </Typography>

                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                >
                                                                    Best Streak
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Stack>
                                                </Paper>
                                            );
                                        }
                                    )}
                            </Stack>
                        )}

                        {/* Current Student Rank */}
                        {!leaderboardLoading &&
                            !leaderboardError &&
                            currentStudent && (
                                <>
                                    <Divider
                                        sx={{
                                            my: 3
                                        }}
                                    />

                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2
                                        }}
                                    >
                                        <Stack
                                            direction={{
                                                xs: "column",
                                                sm: "row"
                                            }}
                                            spacing={2}
                                            justifyContent="space-between"
                                        >
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Your Rank
                                                </Typography>

                                                <Typography
                                                    variant="h5"
                                                    fontWeight={
                                                        700
                                                    }
                                                >
                                                    #
                                                    {
                                                        currentStudent.rank
                                                    }
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Your Points
                                                </Typography>

                                                <Typography
                                                    variant="h5"
                                                    fontWeight={
                                                        700
                                                    }
                                                >
                                                    {
                                                        currentStudent.totalPoints
                                                    }
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Correct
                                                </Typography>

                                                <Typography
                                                    variant="h5"
                                                    fontWeight={
                                                        700
                                                    }
                                                >
                                                    {
                                                        currentStudent.correctAnswers
                                                    }
                                                    /
                                                    {
                                                        currentStudent.attemptedQuestions
                                                    }
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </>
                            )}
                    </CardContent>
                </Card>

                {/* Actions */}
                <Stack
                    direction={{
                        xs: "column",
                        sm: "row"
                    }}
                    spacing={2}
                    justifyContent="center"
                >
                    <Button
                        variant="contained"
                        onClick={() =>
                            navigate(
                                "/student/quiz/join"
                            )
                        }
                    >
                        Join Another Quiz
                    </Button>
                </Stack>
            </Box>
        </DashboardLayout>
    );
};

export default QuizResult;