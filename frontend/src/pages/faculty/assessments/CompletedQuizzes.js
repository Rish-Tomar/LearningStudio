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

import {
    Assessment as AssessmentIcon,
    People as PeopleIcon,
    Visibility as VisibilityIcon
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import quizSessionService from "../../../services/quizSessionService";

const CompletedQuizzes = () => {
    const navigate = useNavigate();

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCompletedQuizzes = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await quizSessionService.getCompletedQuizSessions();

                setSessions(response.data || []);
            } catch (err) {
                console.error(
                    "Failed to load completed quizzes:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                        err?.message ||
                        "Failed to load completed quizzes."
                );
            } finally {
                setLoading(false);
            }
        };

        loadCompletedQuizzes();
    }, []);

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleString();
    };

    return (
        <DashboardLayout>
            <Box
                sx={{
                    maxWidth: 1200,
                    mx: "auto",
                    py: 3
                }}
            >
                {/* Header */}
                <Stack
                    direction={{
                        xs: "column",
                        sm: "row"
                    }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{
                        xs: "flex-start",
                        sm: "center"
                    }}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            Completed Quizzes
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            View quizzes that have already
                            been conducted and review their
                            results.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        onClick={() =>
                            navigate(
                                "/faculty/assessments"
                            )
                        }
                    >
                        Assessments
                    </Button>
                </Stack>

                {/* Error */}
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                {/* Loading */}
                {loading ? (
                    <Box
                        sx={{
                            minHeight: 300,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : sessions.length === 0 ? (
                    <Card>
                        <CardContent>
                            <Stack
                                spacing={2}
                                alignItems="center"
                                sx={{ py: 5 }}
                            >
                                <AssessmentIcon
                                    sx={{
                                        fontSize: 48,
                                        color: "text.secondary"
                                    }}
                                />

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                >
                                    No completed quizzes
                                    yet
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                    textAlign="center"
                                >
                                    Once you conduct and
                                    finish a live quiz, it
                                    will appear here.
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                ) : (
                    <Stack spacing={2}>
                        {sessions.map((session) => (
                            <Card
                                key={session._id}
                                variant="outlined"
                            >
                                <CardContent>
                                    <Stack
                                        spacing={2}
                                    >
                                        {/* Quiz information */}
                                        <Stack
                                            direction={{
                                                xs: "column",
                                                md: "row"
                                            }}
                                            spacing={2}
                                            justifyContent="space-between"
                                            alignItems={{
                                                xs: "flex-start",
                                                md: "center"
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight={
                                                        700
                                                    }
                                                >
                                                    {session
                                                        .assessment
                                                        ?.title ||
                                                        "Untitled Quiz"}
                                                </Typography>

                                                {session
                                                    .assessment
                                                    ?.code && (
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            mt: 0.5
                                                        }}
                                                    >
                                                        Code:{" "}
                                                        {
                                                            session
                                                                .assessment
                                                                .code
                                                        }
                                                    </Typography>
                                                )}
                                            </Box>

                                            <Button
                                                variant="contained"
                                                startIcon={
                                                    <VisibilityIcon />
                                                }
                                                onClick={() =>
                                                    navigate(
                                                        `/faculty/quiz-sessions/${session._id}/results`
                                                    )
                                                }
                                            >
                                                View Results
                                            </Button>
                                        </Stack>

                                        <Divider />

                                        {/* Session information */}
                                        <Box
                                            sx={{
                                                display:
                                                    "grid",
                                                gridTemplateColumns:
                                                    {
                                                        xs: "1fr 1fr",
                                                        sm: "repeat(4, 1fr)"
                                                    },
                                                gap: 2
                                            }}
                                        >
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: 1.5
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Participants
                                                </Typography>

                                                <Stack
                                                    direction="row"
                                                    spacing={
                                                        1
                                                    }
                                                    alignItems="center"
                                                    sx={{
                                                        mt: 0.5
                                                    }}
                                                >
                                                    <PeopleIcon
                                                        fontSize="small"
                                                    />

                                                    <Typography
                                                        fontWeight={
                                                            700
                                                        }
                                                    >
                                                        {
                                                            session.participantCount
                                                        }
                                                    </Typography>
                                                </Stack>
                                            </Paper>

                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: 1.5
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Completed
                                                </Typography>

                                                <Typography
                                                    fontWeight={
                                                        700
                                                    }
                                                    sx={{
                                                        mt: 0.5
                                                    }}
                                                >
                                                    {
                                                        session.submittedCount
                                                    }
                                                </Typography>
                                            </Paper>

                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: 1.5
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Started
                                                </Typography>

                                                <Typography
                                                    fontWeight={
                                                        600
                                                    }
                                                    sx={{
                                                        mt: 0.5
                                                    }}
                                                >
                                                    {formatDate(
                                                        session.startedAt
                                                    )}
                                                </Typography>
                                            </Paper>

                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: 1.5
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Ended
                                                </Typography>

                                                <Typography
                                                    fontWeight={
                                                        600
                                                    }
                                                    sx={{
                                                        mt: 0.5
                                                    }}
                                                >
                                                    {formatDate(
                                                        session.endedAt
                                                    )}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                )}
            </Box>
        </DashboardLayout>
    );
};

export default CompletedQuizzes;