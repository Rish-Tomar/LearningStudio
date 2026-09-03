import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Stack,
    Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import assessmentService from "../../../services/assessmentService";
import quizSessionService from "../../../services/quizSessionService";

const HostQuiz = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [assessment, setAssessment] =
        useState(null);

    const [session, setSession] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [creating, setCreating] =
        useState(false);

    const [error, setError] =
        useState("");

    const [copied, setCopied] =
        useState(false);


    useEffect(() => {

        const initializeSession = async () => {

            try {

                setLoading(true);
                setError("");

                /*
                 * First load the assessment so that
                 * we can display its details.
                 */
                const assessmentResponse =
                    await assessmentService
                        .getAssessmentById(id);

                const assessmentData =
                    assessmentResponse.data;

                setAssessment(assessmentData);

                /*
                 * Create a new live quiz session.
                 */
                setCreating(true);

                const sessionResponse =
                    await quizSessionService
                        .createQuizSession({
                            assessmentId: id,
                            mode: "STUDENT_PACED",
                            maxParticipants: 60
                        });

                setSession(sessionResponse.data);

            } catch (error) {

                console.error(
                    "Failed to initialize quiz session:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to create quiz session"
                );

            } finally {

                setCreating(false);
                setLoading(false);

            }

        };

        if (id) {
            initializeSession();
        }

    }, [id]);

    useEffect(() => {

        if (!session?._id) {
            return;
        }

        if (session.status !== "WAITING") {
            return;
        }

        const refreshSession = async () => {

            try {

                const response =
                    await quizSessionService
                        .getQuizSessionById(
                            session._id
                        );

                setSession(response.data);

            } catch (error) {

                console.error(
                    "Failed to refresh quiz session:",
                    error
                );

            }

        };

        const intervalId =
            setInterval(
                refreshSession,
                2000
            );

        return () => {
            clearInterval(intervalId);
        };

    }, [session?._id, session?.status]);


    const handleCopyJoinCode = async () => {

        if (!session?.joinCode) {
            return;
        }

        try {

            await navigator.clipboard.writeText(
                session.joinCode
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch (error) {

            console.error(
                "Failed to copy join code:",
                error
            );

        }

    };


    const handleStartQuiz = async () => {

        if (!session?._id) {
            return;
        }

        try {

            setError("");

            const response =
                await quizSessionService
                    .startQuizSession( session._id );

            const sessionResponse =
                await quizSessionService
                    .getQuizSessionById(session._id);

            setSession(sessionResponse.data);

        } catch (error) {

            console.error(
                "Failed to start quiz:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to start quiz"
            );

        }

    };


    if (loading || creating) {

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


    if (!session) {

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
                            "Unable to create quiz session"}
                    </Alert>

                    <Button
                        sx={{ mt: 2 }}
                        startIcon={
                            <ArrowBackIcon />
                        }
                        onClick={() =>
                            navigate(
                                "/faculty/assessments"
                            )
                        }
                    >
                        Back to Assessments
                    </Button>

                </Box>

            </DashboardLayout>
        );

    }


    return (
        <DashboardLayout>

            <Box
                sx={{
                    maxWidth: 1000,
                    mx: "auto"
                }}
            >

                {/* Header */}

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

                        <Button
                            startIcon={
                                <ArrowBackIcon />
                            }
                            onClick={() =>
                                navigate(
                                    `/faculty/assessments/${id}`
                                )
                            }
                            sx={{ mb: 1 }}
                        >
                            Back to Assessment
                        </Button>

                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            Host Live Quiz
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            {assessment?.title}
                        </Typography>

                    </Box>

                    <Chip
                        label={session.status}
                        color={
                            session.status === "WAITING"
                                ? "warning"
                                : session.status === "LIVE"
                                    ? "success"
                                    : "default"
                        }
                    />

                </Stack>


                {error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        onClose={() =>
                            setError("")
                        }
                    >
                        {error}
                    </Alert>

                )}


                {/* Lobby */}

                <Card>

                    <CardContent>

                        <Stack
                            alignItems="center"
                            spacing={3}
                            sx={{ py: 4 }}
                        >

                           <Typography
                                variant="h5"
                                fontWeight={600}
                            >
                                {session.status === "WAITING"
                                    ? "Waiting for Students"
                                    : "Quiz is Live"}
                            </Typography>

                            <Typography
                                color="text.secondary"
                                textAlign="center"
                            >
                                Ask your students to join
                                using the code below.
                            </Typography>


                            {/* Join Code */}

                            <Box
                                sx={{
                                    textAlign: "center"
                                }}
                            >

                                <Typography
                                    variant="overline"
                                    color="text.secondary"
                                >
                                    JOIN CODE
                                </Typography>

                                <Typography
                                    variant="h2"
                                    fontWeight={800}
                                    letterSpacing={6}
                                >
                                    {session.joinCode}
                                </Typography>

                                <Button
                                    size="small"
                                    startIcon={
                                        <ContentCopyIcon />
                                    }
                                    onClick={
                                        handleCopyJoinCode
                                    }
                                    sx={{ mt: 1 }}
                                >
                                    {copied
                                        ? "Copied"
                                        : "Copy Code"}
                                </Button>

                            </Box>


                            <Divider
                                sx={{
                                    width: "100%"
                                }}
                            />


                            {/* Session Information */}

                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row"
                                }}
                                spacing={{
                                    xs: 2,
                                    sm: 5
                                }}
                                alignItems="center"
                            >

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >

                                    <PeopleIcon
                                        color="action"
                                    />

                                    <Box>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Participants
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {session.participantCount ||
                                                0}{" "}
                                            /{" "}
                                            {session.maxParticipants}
                                        </Typography>

                                    </Box>

                                </Stack>


                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >

                                    <AccessTimeIcon
                                        color="action"
                                    />

                                    <Box>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Duration
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {session.duration}{" "}
                                            minutes
                                        </Typography>

                                    </Box>

                                </Stack>

                            </Stack>


                            {/* Start */}

                            {session.status ===
                                "WAITING" && (

                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={
                                        <PlayArrowIcon />
                                    }
                                    onClick={
                                        handleStartQuiz
                                    }
                                    sx={{
                                        mt: 2,
                                        px: 5
                                    }}
                                >
                                    Start Quiz
                                </Button>

                            )}


                            {session.status ===
                                "LIVE" && (

                                <Alert
                                    severity="success"
                                    sx={{
                                        width: "100%",
                                        maxWidth: 600
                                    }}
                                >
                                    The quiz is now live.
                                    Students can begin
                                    answering questions.
                                </Alert>

                            )}

                        </Stack>

                    </CardContent>

                </Card>

            </Box>

        </DashboardLayout>
    );

};

export default HostQuiz;