import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    LinearProgress,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import assessmentService from "../../services/assessmentService";
import quizSessionService from "../../services/quizSessionService";

const QuizRunner = () => {

    const navigate = useNavigate();
    const { sessionId } = useParams();

    const [session, setSession] =
        useState(null);

    const [assessment, setAssessment] =
        useState(null);

    const [currentQuestion, setCurrentQuestion] =
        useState(0);

    const [answers, setAnswers] =
        useState({});

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadQuiz = async () => {

            try {

                setLoading(true);
                setError("");

                const sessionResponse =
                    await quizSessionService
                        .getQuizSessionById(
                            sessionId
                        );

                const sessionData =
                    sessionResponse.data;

                setSession(sessionData);

                if (sessionData.status !== "LIVE") {
                    setError(
                        "This quiz is not currently live."
                    );
                    return;
                }

                const assessmentId =
                    sessionData.assessment?._id ||
                    sessionData.assessment;

                if (!assessmentId) {
                    throw new Error(
                        "Assessment information is missing."
                    );
                }

                const assessmentResponse =
                    await assessmentService
                        .getAssessmentById(
                            assessmentId
                        );

                setAssessment(
                    assessmentResponse.data
                );

            } catch (error) {

                console.error(
                    "Failed to load quiz:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load quiz"
                );

            } finally {

                setLoading(false);

            }

        };

        if (sessionId) {
            loadQuiz();
        }

    }, [sessionId]);


    const questions = useMemo(() => {

    if (!assessment?.sections) {
        return [];
    }

    return assessment.sections
        .flatMap(
            (section) =>
                section.questions || []
        )
        .map(
            (item) => ({
                ...item.question,
                marks: item.marks,
                order: item.order
            })
        )
        .sort(
            (a, b) =>
                Number(a.order || 0) -
                Number(b.order || 0)
        );

}, [assessment]);


    const question =
        questions[currentQuestion];


    const handleAnswerSelect = (
        optionIndex
    ) => {

        if (!question) {
            return;
        }

        setAnswers(
            (previousAnswers) => ({
                ...previousAnswers,
                [question._id]:
                    optionIndex
            })
        );

    };


    const handleNext = () => {

        if (
            currentQuestion <
            questions.length - 1
        ) {

            setCurrentQuestion(
                (previous) =>
                    previous + 1
            );

        }

    };


    const handlePrevious = () => {

        if (currentQuestion > 0) {

            setCurrentQuestion(
                (previous) =>
                    previous - 1
            );

        }

    };


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


    if (error || !assessment) {

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
                            "Quiz could not be loaded."}
                    </Alert>

                    <Button
                        sx={{ mt: 2 }}
                        startIcon={
                            <ArrowBackIcon />
                        }
                        onClick={() =>
                            navigate(
                                "/student/quiz/join"
                            )
                        }
                    >
                        Back
                    </Button>

                </Box>

            </DashboardLayout>
        );

    }


    if (questions.length === 0) {

        return (
            <DashboardLayout>

                <Box
                    sx={{
                        maxWidth: 900,
                        mx: "auto"
                    }}
                >

                    <Alert severity="warning">
                        This quiz does not contain
                        any questions.
                    </Alert>

                </Box>

            </DashboardLayout>
        );

    }


    const progress =
        ((currentQuestion + 1) /
            questions.length) *
        100;


    return (
        <DashboardLayout>

            <Box
                sx={{
                    maxWidth: 1000,
                    mx: "auto"
                }}
            >

                {/* Quiz Header */}

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
                    sx={{ mb: 2 }}
                >

                    <Box>

                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            {assessment.title}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Live Quiz
                        </Typography>

                    </Box>

                    <Typography
                        fontWeight={600}
                    >
                        Question{" "}
                        {currentQuestion + 1}{" "}
                        of {questions.length}
                    </Typography>

                </Stack>


                {/* Progress */}

                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        mb: 3
                    }}
                />


                {/* Question */}

                <Card>

                    <CardContent
                        sx={{ p: { xs: 2, sm: 4 } }}
                    >

                        <Stack spacing={3}>

                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >

                                <Typography
                                    variant="overline"
                                    color="text.secondary"
                                >
                                    Question{" "}
                                    {currentQuestion + 1}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {question.marks || 0}{" "}
                                    {Number(
                                        question.marks || 0
                                    ) === 1
                                        ? "mark"
                                        : "marks"}
                                </Typography>

                            </Stack>


                            <Typography
                                variant="h5"
                                fontWeight={600}
                                sx={{
                                    whiteSpace:
                                        "pre-wrap"
                                }}
                            >
                                {question.title ||
                                    question.question ||
                                    "Question text unavailable"}
                            </Typography>


                            {/* Options */}

                            <Stack spacing={2}>

                                {(question.options ||
                                    []).map(
                                    (
                                        option,
                                        optionIndex
                                    ) => {

                                        const optionText =
                                            typeof option ===
                                            "string"
                                                ? option
                                                : option.text ||
                                                  option.label ||
                                                  "";

                                        const selected =
                                            answers[
                                                question._id
                                            ] ===
                                            optionIndex;

                                        return (

                                            <Paper
                                                key={
                                                    optionIndex
                                                }
                                                variant="outlined"
                                                onClick={() =>
                                                    handleAnswerSelect(
                                                        optionIndex
                                                    )
                                                }
                                                sx={{
                                                    p: 2,
                                                    cursor:
                                                        "pointer",
                                                    borderWidth:
                                                        selected
                                                            ? 2
                                                            : 1,
                                                    borderColor:
                                                        selected
                                                            ? "primary.main"
                                                            : "divider",
                                                    bgcolor:
                                                        selected
                                                            ? "action.selected"
                                                            : "background.paper",
                                                    transition:
                                                        "all 0.15s ease"
                                                }}
                                            >

                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center"
                                                >

                                                    <Box
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius:
                                                                "50%",
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            border: 1,
                                                            borderColor:
                                                                selected
                                                                    ? "primary.main"
                                                                    : "divider",
                                                            fontWeight:
                                                                700
                                                        }}
                                                    >
                                                        {String.fromCharCode(
                                                            65 +
                                                                optionIndex
                                                        )}
                                                    </Box>

                                                    <Typography>
                                                        {
                                                            optionText
                                                        }
                                                    </Typography>

                                                </Stack>

                                            </Paper>

                                        );

                                    }
                                )}

                            </Stack>


                            {/* Navigation */}

                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                spacing={2}
                                sx={{ pt: 2 }}
                            >

                                <Button
                                    variant="outlined"
                                    startIcon={
                                        <ArrowBackIcon />
                                    }
                                    disabled={
                                        currentQuestion ===
                                        0
                                    }
                                    onClick={
                                        handlePrevious
                                    }
                                >
                                    Previous
                                </Button>


                                <Button
                                    variant="contained"
                                    endIcon={
                                        <ArrowForwardIcon />
                                    }
                                    disabled={
                                        currentQuestion ===
                                        questions.length - 1
                                    }
                                    onClick={
                                        handleNext
                                    }
                                >
                                    Next
                                </Button>

                            </Stack>

                        </Stack>

                    </CardContent>

                </Card>

            </Box>

        </DashboardLayout>
    );

};

export default QuizRunner;