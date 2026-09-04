import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    LinearProgress,
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

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import PeopleIcon from "@mui/icons-material/People";
import RefreshIcon from "@mui/icons-material/Refresh";

import DashboardLayout from "../../../layouts/DashboardLayout";
import assessmentService from "../../../services/assessmentService";
import quizSessionService from "../../../services/quizSessionService";


const POLLING_INTERVAL = 2000;

const SESSION_STATUS = {
    WAITING: "WAITING",
    LIVE: "LIVE",
    PAUSED: "PAUSED",
    ENDED: "ENDED"
};


const getStatusColor = (status) => {
    switch (status) {
        case "SUBMITTED":
            return "success";

        case "IN_PROGRESS":
            return "primary";

        case "JOINED":
            return "warning";

        case "TIMED_OUT":
            return "error";

        default:
            return "default";
    }
};


const formatAttemptStatus = (status) => {
    switch (status) {
        case "IN_PROGRESS":
            return "In Progress";

        case "SUBMITTED":
            return "Submitted";

        case "JOINED":
            return "Joined";

        case "TIMED_OUT":
            return "Timed Out";

        default:
            return status || "Unknown";
    }
};


const HostQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [assessment, setAssessment] = useState(null);
    const [session, setSession] = useState(null);
    const [leaderboard, setLeaderboard] = useState(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [starting, setStarting] = useState(false);
    const [ending, setEnding] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [endDialogOpen, setEndDialogOpen] = useState(false);


    /*
     * Load assessment and create/reuse the quiz session.
     */
    const initializeSession = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const assessmentResponse =
                await assessmentService.getAssessmentById(id);

            const assessmentData =
                assessmentResponse?.data || assessmentResponse;

            setAssessment(assessmentData);

            const sessionResponse =
                await quizSessionService.createQuizSession({
                    assessmentId: id,
                    mode: "STUDENT_PACED",
                    maxParticipants: 60
                });

            const createdSession =
                sessionResponse?.data || sessionResponse;

            /*
             * Fetch the complete session immediately so that
             * participantCount and other populated information
             * are available.
             */
            const sessionDetailsResponse =
                await quizSessionService.getQuizSessionById(
                    createdSession._id
                );

            const sessionDetails =
                sessionDetailsResponse?.data ||
                sessionDetailsResponse;

            setSession(sessionDetails);

            /*
             * Load leaderboard if the session already has
             * participants.
             */
            if (
                sessionDetails.status === SESSION_STATUS.LIVE ||
                sessionDetails.status === SESSION_STATUS.ENDED ||
                sessionDetails.status === SESSION_STATUS.PAUSED
            ) {
                await refreshLeaderboard(
                    sessionDetails._id,
                    false
                );
            }
        } catch (err) {
            console.error("Failed to initialize quiz session:", err);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to initialize quiz session."
            );
        } finally {
            setLoading(false);
        }
    }, [id]);


    /*
     * Fetch current session information.
     */
    const refreshSession = useCallback(async () => {
        if (!session?._id) {
            return null;
        }

        try {
            const response =
                await quizSessionService.getQuizSessionById(
                    session._id
                );

            const sessionData =
                response?.data || response;

            setSession(sessionData);

            return sessionData;
        } catch (err) {
            console.error("Failed to refresh quiz session:", err);

            return null;
        }
    }, [session?._id]);


    /*
     * Fetch the current leaderboard.
     */
    const refreshLeaderboard = useCallback(
        async (sessionId = session?._id, showLoading = true) => {
            if (!sessionId) {
                return;
            }

            try {
                if (showLoading) {
                    setRefreshing(true);
                }

                const response =
                    await quizSessionService.getQuizLeaderboard(
                        sessionId
                    );

                const leaderboardData =
                    response?.data || response;

                setLeaderboard(leaderboardData);
            } catch (err) {
                console.error(
                    "Failed to refresh leaderboard:",
                    err
                );
            } finally {
                if (showLoading) {
                    setRefreshing(false);
                }
            }
        },
        [session?._id]
    );


    /*
     * Initial loading.
     */
    useEffect(() => {
        initializeSession();
    }, [initializeSession]);


    /*
     * Poll session and leaderboard while the quiz is active.
     *
     * WAITING:
     *   Mainly used to update participant count.
     *
     * LIVE:
     *   Updates participant count + leaderboard.
     *
     * PAUSED:
     *   Keeps the host screen current.
     *
     * ENDED:
     *   No polling is necessary.
     */
    useEffect(() => {
        if (!session?._id) {
            return undefined;
        }

        if (session.status === SESSION_STATUS.ENDED) {
            return undefined;
        }

        const intervalId = setInterval(async () => {
            const latestSession = await refreshSession();

            if (!latestSession) {
                return;
            }

            if (
                latestSession.status === SESSION_STATUS.LIVE ||
                latestSession.status === SESSION_STATUS.PAUSED ||
                latestSession.status === SESSION_STATUS.ENDED
            ) {
                await refreshLeaderboard(
                    latestSession._id,
                    false
                );
            }
        }, POLLING_INTERVAL);

        return () => clearInterval(intervalId);
    }, [
        session?._id,
        session?.status,
        refreshSession,
        refreshLeaderboard
    ]);


    /*
     * Copy join code.
     */
    const handleCopyJoinCode = async () => {
        if (!session?.joinCode) {
            return;
        }

        try {
            await navigator.clipboard.writeText(
                session.joinCode
            );

            setSuccess("Join code copied to clipboard.");

            setTimeout(() => {
                setSuccess("");
            }, 2000);
        } catch (err) {
            console.error(
                "Failed to copy join code:",
                err
            );

            setError("Unable to copy the join code.");
        }
    };


    /*
     * Start the quiz.
     */
    const handleStartQuiz = async () => {
        if (!session?._id) {
            return;
        }

        try {
            setStarting(true);
            setError("");
            setSuccess("");

            await quizSessionService.startQuizSession(
                session._id
            );

            const latestSession =
                await refreshSession();

            if (latestSession) {
                await refreshLeaderboard(
                    latestSession._id,
                    false
                );
            }

            setSuccess("Quiz started successfully.");
        } catch (err) {
            console.error(
                "Failed to start quiz:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to start the quiz."
            );
        } finally {
            setStarting(false);
        }
    };


    /*
     * Open end confirmation dialog.
     */
    const handleOpenEndDialog = () => {
        setEndDialogOpen(true);
    };


    /*
     * Close end confirmation dialog.
     */
    const handleCloseEndDialog = () => {
        if (!ending) {
            setEndDialogOpen(false);
        }
    };


    /*
     * End the quiz.
     */
    const handleEndQuiz = async () => {
        if (!session?._id) {
            return;
        }

        try {
            setEnding(true);
            setError("");
            setSuccess("");

            await quizSessionService.endQuizSession(
                session._id
            );

            const latestSession =
                await refreshSession();

            await refreshLeaderboard(
                session._id,
                false
            );

            setEndDialogOpen(false);

            if (latestSession?.status === SESSION_STATUS.ENDED) {
                setSuccess(
                    "Quiz ended successfully. Final leaderboard is shown below."
                );
            }
        } catch (err) {
            console.error(
                "Failed to end quiz:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to end the quiz."
            );
        } finally {
            setEnding(false);
        }
    };


    /*
     * Manual leaderboard refresh.
     */
    const handleManualRefresh = async () => {
        if (!session?._id) {
            return;
        }

        await refreshSession();
        await refreshLeaderboard(
            session._id,
            true
        );
    };


    const participantCount = useMemo(() => {
        if (typeof session?.participantCount === "number") {
            return session.participantCount;
        }

        if (
            typeof leaderboard?.totalParticipants === "number"
        ) {
            return leaderboard.totalParticipants;
        }

        return 0;
    }, [
        session?.participantCount,
        leaderboard?.totalParticipants
    ]);


    const leaderboardEntries =
        leaderboard?.leaderboard || [];


    /*
     * Loading state.
     */
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


    /*
     * Error state.
     */
    if (error && !session) {
        return (
            <DashboardLayout>
                <Box sx={{ p: 3 }}>
                    <Alert severity="error">
                        {error}
                    </Alert>

                    <Button
                        sx={{ mt: 2 }}
                        variant="outlined"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </Button>
                </Box>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout>
            <Box
                sx={{
                    p: { xs: 2, md: 3 },
                    maxWidth: 1400,
                    mx: "auto"
                }}
            >
                {/* Page Header */}
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
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            Host Quiz
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            {assessment?.title ||
                                session?.assessment?.title ||
                                "Quiz"}
                        </Typography>
                    </Box>

                    <Chip
                        label={
                            session?.status ||
                            "UNKNOWN"
                        }
                        color={
                            session?.status ===
                            SESSION_STATUS.LIVE
                                ? "success"
                                : session?.status ===
                                  SESSION_STATUS.ENDED
                                ? "default"
                                : "warning"
                        }
                        sx={{
                            fontWeight: 700
                        }}
                    />
                </Stack>


                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        onClose={() => setError("")}
                    >
                        {error}
                    </Alert>
                )}


                {success && (
                    <Alert
                        severity="success"
                        sx={{ mb: 2 }}
                        onClose={() => setSuccess("")}
                    >
                        {success}
                    </Alert>
                )}


                {/* WAITING ROOM */}
                {session?.status ===
                    SESSION_STATUS.WAITING && (
                    <>
                        <Paper
                            elevation={2}
                            sx={{
                                p: {
                                    xs: 3,
                                    md: 5
                                },
                                mb: 3,
                                textAlign: "center"
                            }}
                        >
                            <Typography
                                variant="h5"
                                fontWeight={700}
                                gutterBottom
                            >
                                Waiting for Students
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{ mb: 4 }}
                            >
                                Ask students to join using
                                the code below.
                            </Typography>


                            {/* Join Code */}
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    mb: 4
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        mb: 1,
                                        textTransform:
                                            "uppercase",
                                        letterSpacing: 1
                                    }}
                                >
                                    Join Code
                                </Typography>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <Typography
                                        variant="h2"
                                        fontWeight={800}
                                        letterSpacing={6}
                                    >
                                        {session.joinCode}
                                    </Typography>

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={
                                            handleCopyJoinCode
                                        }
                                        startIcon={
                                            <ContentCopyIcon />
                                        }
                                    >
                                        Copy
                                    </Button>
                                </Stack>
                            </Box>


                            <Divider sx={{ mb: 3 }} />


                            {/* Participant Count */}
                            <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="center"
                                alignItems="center"
                                sx={{ mb: 3 }}
                            >
                                <PeopleIcon />

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    {participantCount}
                                </Typography>

                                <Typography color="text.secondary">
                                    participant
                                    {participantCount === 1
                                        ? ""
                                        : "s"}
                                </Typography>
                            </Stack>


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
                                    size="large"
                                    startIcon={
                                        <PlayArrowIcon />
                                    }
                                    onClick={
                                        handleStartQuiz
                                    }
                                    disabled={
                                        starting
                                    }
                                >
                                    {starting
                                        ? "Starting..."
                                        : "Start Quiz"}
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={
                                        handleManualRefresh
                                    }
                                    disabled={
                                        refreshing
                                    }
                                    startIcon={
                                        <RefreshIcon />
                                    }
                                >
                                    Refresh
                                </Button>
                            </Stack>
                        </Paper>


                        {/* Session Information */}
                        <Paper
                            variant="outlined"
                            sx={{ p: 3 }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                gutterBottom
                            >
                                Quiz Information
                            </Typography>

                            <Divider
                                sx={{ mb: 2 }}
                            />

                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row"
                                }}
                                spacing={4}
                            >
                                <Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Duration
                                    </Typography>

                                    <Typography fontWeight={600}>
                                        {session?.duration ||
                                            assessment?.duration ||
                                            0}{" "}
                                        minutes
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Maximum Participants
                                    </Typography>

                                    <Typography fontWeight={600}>
                                        {session?.maxParticipants ||
                                            60}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Mode
                                    </Typography>

                                    <Typography fontWeight={600}>
                                        Student Paced
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </>
                )}


                {/* LIVE QUIZ */}
                {session?.status ===
                    SESSION_STATUS.LIVE && (
                    <>
                        {/* Live Summary */}
                        <Stack
                            direction={{
                                xs: "column",
                                md: "row"
                            }}
                            spacing={2}
                            sx={{ mb: 3 }}
                        >
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    flex: 1
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                >
                                    <PeopleIcon />

                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Participants
                                        </Typography>

                                        <Typography
                                            variant="h4"
                                            fontWeight={800}
                                        >
                                            {
                                                participantCount
                                            }
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>


                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    flex: 1
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Students Answered
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={800}
                                >
                                    {
                                        leaderboardEntries.filter(
                                            (entry) =>
                                                entry.attemptedQuestions >
                                                0
                                        ).length
                                    }
                                </Typography>
                            </Paper>


                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    flex: 1
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Submitted
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={800}
                                >
                                    {
                                        leaderboardEntries.filter(
                                            (entry) =>
                                                entry.status ===
                                                "SUBMITTED"
                                        ).length
                                    }
                                </Typography>
                            </Paper>
                        </Stack>


                        {/* Live Controls */}
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                mb: 3
                            }}
                        >
                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row"
                                }}
                                justifyContent="space-between"
                                alignItems={{
                                    xs: "stretch",
                                    sm: "center"
                                }}
                                spacing={2}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <Chip
                                        label="LIVE"
                                        color="success"
                                        size="small"
                                    />

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Leaderboard updates
                                        automatically.
                                    </Typography>
                                </Stack>

                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row"
                                    }}
                                    spacing={1}
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={
                                            handleManualRefresh
                                        }
                                        disabled={
                                            refreshing
                                        }
                                        startIcon={
                                            <RefreshIcon />
                                        }
                                    >
                                        {refreshing
                                            ? "Refreshing..."
                                            : "Refresh"}
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={
                                            <StopIcon />
                                        }
                                        onClick={
                                            handleOpenEndDialog
                                        }
                                        disabled={
                                            ending
                                        }
                                    >
                                        End Quiz
                                    </Button>
                                </Stack>
                            </Stack>
                        </Paper>


                        {/* Live Leaderboard */}
                        <Paper
                            variant="outlined"
                            sx={{ overflow: "hidden" }}
                        >
                            <Box sx={{ p: 3 }}>
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    Live Leaderboard
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                >
                                    Rankings are based on
                                    points, correctness,
                                    completion and streak.
                                </Typography>
                            </Box>

                            <Divider />

                            {refreshing &&
                                leaderboardEntries.length ===
                                    0 && (
                                    <LinearProgress />
                                )}

                            <TableContainer
                                sx={{
                                    maxHeight: 560
                                }}
                            >
                                <Table
                                    stickyHeader
                                    size="small"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Rank
                                            </TableCell>

                                            <TableCell>
                                                Student
                                            </TableCell>

                                            <TableCell>
                                                Status
                                            </TableCell>

                                            <TableCell align="center">
                                                Attempted
                                            </TableCell>

                                            <TableCell align="center">
                                                Correct
                                            </TableCell>

                                            <TableCell align="center">
                                                Points
                                            </TableCell>

                                            <TableCell align="center">
                                                Streak
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {leaderboardEntries.length ===
                                            0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={7}
                                                    align="center"
                                                    sx={{
                                                        py: 5
                                                    }}
                                                >
                                                    <Typography
                                                        color="text.secondary"
                                                    >
                                                        No students
                                                        have joined
                                                        yet.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}

                                        {leaderboardEntries.map(
                                            (entry) => (
                                                <TableRow
                                                    key={
                                                        entry.attemptId
                                                    }
                                                    sx={{
                                                        "&:last-child td":
                                                            {
                                                                border: 0
                                                            }
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Typography
                                                            fontWeight={
                                                                entry.rank <=
                                                                3
                                                                    ? 800
                                                                    : 500
                                                            }
                                                        >
                                                            #
                                                            {
                                                                entry.rank
                                                            }
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Typography fontWeight={600}>
                                                            {
                                                                entry
                                                                    .student
                                                                    ?.name ||
                                                                "Student"
                                                            }
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Chip
                                                            label={formatAttemptStatus(
                                                                entry.status
                                                            )}
                                                            color={getStatusColor(
                                                                entry.status
                                                            )}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        {
                                                            entry.attemptedQuestions
                                                        }
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        {
                                                            entry.correctAnswers
                                                        }
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Typography
                                                            fontWeight={
                                                                700
                                                            }
                                                        >
                                                            {
                                                                entry.totalPoints
                                                            }
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Chip
                                                            label={`🔥 ${
                                                                entry.currentStreak ||
                                                                0
                                                            }`}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </>
                )}


                {/* PAUSED */}
                {session?.status ===
                    SESSION_STATUS.PAUSED && (
                    <>
                        <Alert
                            severity="warning"
                            sx={{ mb: 3 }}
                        >
                            The quiz is currently paused.
                        </Alert>

                        <Paper
                            variant="outlined"
                            sx={{ p: 3 }}
                        >
                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row"
                                }}
                                justifyContent="space-between"
                                spacing={2}
                            >
                                <Box>
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                    >
                                        Quiz Paused
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                    >
                                        {
                                            participantCount
                                        }{" "}
                                        participant
                                        {participantCount ===
                                        1
                                            ? ""
                                            : "s"}{" "}
                                        are currently
                                        registered.
                                    </Typography>
                                </Box>

                                <Button
                                    variant="outlined"
                                    startIcon={
                                        <RefreshIcon />
                                    }
                                    onClick={
                                        handleManualRefresh
                                    }
                                >
                                    Refresh
                                </Button>
                            </Stack>
                        </Paper>
                    </>
                )}


                {/* ENDED */}
                {session?.status ===
                    SESSION_STATUS.ENDED && (
                    <>
                        <Alert
                            severity="info"
                            sx={{ mb: 3 }}
                        >
                            The quiz has ended. The
                            leaderboard below shows the
                            final rankings.
                        </Alert>


                        <Stack
                            direction={{
                                xs: "column",
                                md: "row"
                            }}
                            spacing={2}
                            sx={{ mb: 3 }}
                        >
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    flex: 1
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Total Participants
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={800}
                                >
                                    {
                                        leaderboard?.totalParticipants ||
                                        participantCount
                                    }
                                </Typography>
                            </Paper>

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    flex: 1
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Completed
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={800}
                                >
                                    {
                                        leaderboardEntries.filter(
                                            (entry) =>
                                                entry.status ===
                                                "SUBMITTED"
                                        ).length
                                    }
                                </Typography>
                            </Paper>

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    flex: 1
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Timed Out
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={800}
                                >
                                    {
                                        leaderboardEntries.filter(
                                            (entry) =>
                                                entry.status ===
                                                "TIMED_OUT"
                                        ).length
                                    }
                                </Typography>
                            </Paper>
                        </Stack>


                        <Paper
                            variant="outlined"
                            sx={{ overflow: "hidden" }}
                        >
                            <Box sx={{ p: 3 }}>
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    Final Leaderboard
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                >
                                    Final quiz rankings and
                                    performance.
                                </Typography>
                            </Box>

                            <Divider />

                            <TableContainer
                                sx={{
                                    maxHeight: 600
                                }}
                            >
                                <Table
                                    stickyHeader
                                    size="small"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Rank
                                            </TableCell>

                                            <TableCell>
                                                Student
                                            </TableCell>

                                            <TableCell>
                                                Status
                                            </TableCell>

                                            <TableCell align="center">
                                                Attempted
                                            </TableCell>

                                            <TableCell align="center">
                                                Correct
                                            </TableCell>

                                            <TableCell align="center">
                                                Points
                                            </TableCell>

                                            <TableCell align="center">
                                                Best Streak
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {leaderboardEntries.map(
                                            (entry) => (
                                                <TableRow
                                                    key={
                                                        entry.attemptId
                                                    }
                                                >
                                                    <TableCell>
                                                        <Typography
                                                            fontWeight={
                                                                entry.rank <=
                                                                3
                                                                    ? 800
                                                                    : 500
                                                            }
                                                        >
                                                            #
                                                            {
                                                                entry.rank
                                                            }
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Typography fontWeight={600}>
                                                            {
                                                                entry
                                                                    .student
                                                                    ?.name ||
                                                                "Student"
                                                            }
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Chip
                                                            label={formatAttemptStatus(
                                                                entry.status
                                                            )}
                                                            color={getStatusColor(
                                                                entry.status
                                                            )}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        {
                                                            entry.attemptedQuestions
                                                        }
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        {
                                                            entry.correctAnswers
                                                        }
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Typography
                                                            fontWeight={
                                                                700
                                                            }
                                                        >
                                                            {
                                                                entry.totalPoints
                                                            }
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        {
                                                            entry.longestStreak
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </>
                )}
            </Box>


            {/* End Quiz Confirmation */}
            <Dialog
                open={endDialogOpen}
                onClose={handleCloseEndDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    End Quiz?
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Ending the quiz will stop the live
                        session. Students who have not
                        submitted will be marked as timed
                        out, and the final leaderboard will
                        be generated.
                    </DialogContentText>

                    <Alert
                        severity="warning"
                        sx={{ mt: 2 }}
                    >
                        This action cannot be undone.
                    </Alert>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={
                            handleCloseEndDialog
                        }
                        disabled={ending}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleEndQuiz}
                        disabled={ending}
                        startIcon={<StopIcon />}
                    >
                        {ending
                            ? "Ending..."
                            : "End Quiz"}
                    </Button>
                </DialogActions>
            </Dialog>
        </DashboardLayout>
    );
};


export default HostQuiz;