import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import LoginIcon from "@mui/icons-material/Login";

import DashboardLayout from "../../layouts/DashboardLayout";
import quizSessionService from "../../services/quizSessionService";

const StudentJoinQuiz = () => {

    const navigate = useNavigate();
    const [joinCode, setJoinCode] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [attempt, setAttempt] =  useState(null);

    const [session,setSession] = useState(null);

    const handleJoinCodeChange = (event) => {

        const value =
            event.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .slice(0, 6);

        setJoinCode(value);
        setError("");
        setSuccess("");

    };


    const handleJoinQuiz = async () => {

        setError("");
        setSuccess("");

        if (joinCode.length !== 6) {

            setError(
                "Please enter the 6-character quiz code"
            );

            return;

        }


        try {

            setLoading(true);

            const response =
                await quizSessionService
                    .joinQuizSession(joinCode);

            setAttempt(response.data);

            setSession({ _id: response.data.session,status: "WAITING"});

            setSuccess(
                "You joined the quiz successfully!"
            );

        } catch (error) {

            console.error(
                "Failed to join quiz:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to join quiz"
            );

        } finally {

            setLoading(false);

        }

    };

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

                const updatedSession = response.data;

                setSession(updatedSession);

                if (updatedSession.status === "LIVE") {
                    navigate(`/student/quiz/${updatedSession._id}`);
                }

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


    return (
        <DashboardLayout>

            <Box
                sx={{
                    maxWidth: 700,
                    mx: "auto",
                    mt: 4
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ mb: 1 }}
                >
                    Join Live Quiz
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 4 }}
                >
                    Enter the quiz code provided by
                    your faculty member.
                </Typography>


                <Card>

                    <CardContent sx={{ p: 4 }}>

                        <Stack spacing={3}>

                            {!attempt && (

                                <>

                                    <TextField
                                        fullWidth
                                        label="Quiz Code"
                                        value={joinCode}
                                        onChange={
                                            handleJoinCodeChange
                                        }
                                        placeholder="Enter 6-character code"
                                        inputProps={{
                                            maxLength: 6,
                                            style: {
                                                textTransform:
                                                    "uppercase",
                                                letterSpacing:
                                                    "4px",
                                                textAlign:
                                                    "center",
                                                fontSize:
                                                    "1.5rem",
                                                fontWeight:
                                                    700
                                            }
                                        }}
                                        helperText={`${joinCode.length}/6 characters`}
                                        autoFocus
                                    />

                                    {error && (

                                        <Alert
                                            severity="error"
                                        >
                                            {error}
                                        </Alert>

                                    )}

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        startIcon={
                                            loading
                                                ? <CircularProgress
                                                    size={20}
                                                    color="inherit"
                                                />
                                                : <LoginIcon />
                                        }
                                        onClick={
                                            handleJoinQuiz
                                        }
                                        disabled={
                                            loading ||
                                            joinCode.length !== 6
                                        }
                                    >
                                        {loading
                                            ? "Joining..."
                                            : "Join Quiz"}
                                    </Button>

                                </>

                            )}


                            {attempt && (

                                <>

                                    <Alert
                                        severity="success"
                                    >
                                        {success}
                                    </Alert>

                                    <Box
                                        sx={{
                                            textAlign:
                                                "center",
                                            py: 3
                                        }}
                                    >

                                        <Typography
                                            variant="h5"
                                            fontWeight={700}
                                            sx={{ mb: 1 }}
                                        >
                                            You're In!
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                        >
                                            You have joined the
                                            quiz successfully.
                                        </Typography>

                                    </Box>


                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor:
                                                "background.default"
                                        }}
                                    >

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Quiz Code
                                        </Typography>

                                        <Typography
                                            fontWeight={700}
                                        >
                                            {joinCode}
                                        </Typography>

                                    </Box>


                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor:
                                                "background.default"
                                        }}
                                    >

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Status
                                        </Typography>

                                        <Typography
                                            fontWeight={700}
                                        >
                                            {session?.status === "LIVE"
                                                ? "Quiz Starting..."
                                                : "Waiting for Host"}
                                        </Typography>

                                    </Box>


                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        textAlign="center"
                                    >
                                        {session?.status === "LIVE"
                                            ? "The host has started the quiz."
                                            : "Please wait for your faculty member to start the quiz."}
                                    </Typography>

                                </>

                            )}

                        </Stack>

                    </CardContent>

                </Card>

            </Box>

        </DashboardLayout>
    );

};

export default StudentJoinQuiz;