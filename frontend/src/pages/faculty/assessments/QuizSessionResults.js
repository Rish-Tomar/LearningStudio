import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

import {
    ArrowBack as ArrowBackIcon,
    CheckCircle as CheckCircleIcon,
    EmojiEvents as EmojiEventsIcon,
    People as PeopleIcon,
    Refresh as RefreshIcon,
    Score as ScoreIcon
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";

import quizSessionService from "../../../services/quizSessionService";

const QuizSessionResults = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [session, setSession] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadResults = async (isRefresh = false) => {
        try {
            setError("");

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const [sessionResponse, leaderboardResponse] = await Promise.all([
                quizSessionService.getQuizSessionById(sessionId),
                quizSessionService.getQuizLeaderboard(sessionId)
            ]);

            setSession(sessionResponse.data);
            setLeaderboard(leaderboardResponse.data?.leaderboard || []);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    "Unable to load quiz results."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (sessionId) {
            loadResults();
        }
    }, [sessionId]);

    const statistics = useMemo(() => {
        const totalParticipants = leaderboard.length;

        const completedParticipants = leaderboard.filter(
            (student) =>
                student.status === "SUBMITTED" ||
                student.status === "TIMED_OUT"
        ).length;

        const totalPoints = leaderboard.reduce(
            (sum, student) => sum + (student.totalPoints || 0),
            0
        );

        const highestPoints =
            totalParticipants > 0
                ? Math.max(
                      ...leaderboard.map(
                          (student) => student.totalPoints || 0
                      )
                  )
                : 0;

        const averagePoints =
            totalParticipants > 0
                ? Math.round(totalPoints / totalParticipants)
                : 0;

        return {
            totalParticipants,
            completedParticipants,
            highestPoints,
            averagePoints
        };
    }, [leaderboard]);

    const getAccuracy = (student) => {
        if (!student.attemptedQuestions) {
            return 0;
        }

        return Math.round(
            ((student.correctAnswers || 0) /
                student.attemptedQuestions) *
                100
        );
    };

    const getStatusChip = (status) => {
        switch (status) {
            case "SUBMITTED":
                return (
                    <Chip
                        label="Submitted"
                        size="small"
                        color="success"
                    />
                );

            case "TIMED_OUT":
                return (
                    <Chip
                        label="Timed Out"
                        size="small"
                        color="warning"
                    />
                );

            case "IN_PROGRESS":
                return (
                    <Chip
                        label="In Progress"
                        size="small"
                        color="info"
                    />
                );

            default:
                return (
                    <Chip
                        label={status || "Joined"}
                        size="small"
                    />
                );
        }
    };

    if (loading) {
        return (
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
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>

                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() =>
                        navigate("/faculty/quiz-sessions/completed")
                    }
                >
                    Back to Completed Quizzes
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* Header */}
            <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() =>
                            navigate("/faculty/quiz-sessions/completed")
                        }
                        sx={{ mb: 1 }}
                    >
                        Completed Quizzes
                    </Button>

                    <Typography variant="h4" fontWeight={700}>
                        {session?.assessment?.title || "Quiz Results"}
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        sx={{ mt: 1 }}
                    >
                        {session?.assessment?.code && (
                            <Chip
                                label={`Code: ${session.assessment.code}`}
                                size="small"
                            />
                        )}

                        <Chip
                            label={session?.status || "ENDED"}
                            color="success"
                            size="small"
                        />

                        {session?.joinCode && (
                            <Chip
                                label={`Join Code: ${session.joinCode}`}
                                size="small"
                                variant="outlined"
                            />
                        )}
                    </Stack>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => loadResults(true)}
                    disabled={refreshing}
                >
                    {refreshing ? "Refreshing..." : "Refresh"}
                </Button>
            </Stack>

            {/* Statistics */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                <PeopleIcon color="primary" />

                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Participants
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                    >
                                        {statistics.totalParticipants}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                <CheckCircleIcon color="success" />

                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Completed
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                    >
                                        {statistics.completedParticipants}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                <EmojiEventsIcon color="warning" />

                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Highest Score
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                    >
                                        {statistics.highestPoints}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                <ScoreIcon color="info" />

                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Average Score
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                    >
                                        {statistics.averagePoints}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Session Information */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={700}>
                        Session Information
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Duration
                            </Typography>

                            <Typography fontWeight={600}>
                                {session?.duration || 0} minutes
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Started
                            </Typography>

                            <Typography fontWeight={600}>
                                {session?.startedAt
                                    ? new Date(
                                          session.startedAt
                                      ).toLocaleString()
                                    : "—"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Ended
                            </Typography>

                            <Typography fontWeight={600}>
                                {session?.endedAt
                                    ? new Date(
                                          session.endedAt
                                      ).toLocaleString()
                                    : "—"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Mode
                            </Typography>

                            <Typography fontWeight={600}>
                                {session?.mode || "Student Paced"}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
                <CardContent>
                    <Typography variant="h6" fontWeight={700}>
                        Student Performance
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5, mb: 2 }}
                    >
                        Final performance of all students who joined this
                        quiz.
                    </Typography>

                    <TableContainer
                        component={Paper}
                        variant="outlined"
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <strong>Rank</strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>Student</strong>
                                    </TableCell>

                                    <TableCell align="center">
                                        <strong>Status</strong>
                                    </TableCell>

                                    <TableCell align="center">
                                        <strong>Attempted</strong>
                                    </TableCell>

                                    <TableCell align="center">
                                        <strong>Correct</strong>
                                    </TableCell>

                                    <TableCell align="center">
                                        <strong>Accuracy</strong>
                                    </TableCell>

                                    <TableCell align="center">
                                        <strong>Points</strong>
                                    </TableCell>

                                    <TableCell align="center">
                                        <strong>Current Streak</strong>
                                    </TableCell>

                                    <TableCell align="center">
                                        <strong>Best Streak</strong>
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {leaderboard.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={9}
                                            align="center"
                                        >
                                            <Typography
                                                color="text.secondary"
                                                sx={{ py: 4 }}
                                            >
                                                No participants found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    leaderboard.map((student, index) => (
                                        <TableRow
                                            key={
                                                student.attemptId ||
                                                student._id ||
                                                index
                                            }
                                            hover
                                        >
                                            <TableCell>
                                                <Typography
                                                    fontWeight={
                                                        index < 3
                                                            ? 700
                                                            : 400
                                                    }
                                                >
                                                    #{index + 1}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Typography fontWeight={600}>
                                                    {student.student?.name ||
                                                        student.studentName ||
                                                        "Unknown Student"}
                                                </Typography>

                                                {student.student?.email && (
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {
                                                            student.student
                                                                .email
                                                        }
                                                    </Typography>
                                                )}
                                            </TableCell>

                                            <TableCell align="center">
                                                {getStatusChip(
                                                    student.status
                                                )}
                                            </TableCell>

                                            <TableCell align="center">
                                                {student.attemptedQuestions ||
                                                    0}
                                            </TableCell>

                                            <TableCell align="center">
                                                {student.correctAnswers || 0}
                                            </TableCell>

                                            <TableCell align="center">
                                                {getAccuracy(student)}%
                                            </TableCell>

                                            <TableCell align="center">
                                                <Typography
                                                    fontWeight={700}
                                                >
                                                    {student.totalPoints || 0}
                                                </Typography>
                                            </TableCell>

                                            <TableCell align="center">
                                                {student.currentStreak || 0}
                                            </TableCell>

                                            <TableCell align="center">
                                                {student.longestStreak || 0}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
};

export default QuizSessionResults;