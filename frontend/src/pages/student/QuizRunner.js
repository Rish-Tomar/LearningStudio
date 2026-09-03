import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
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

    const [visitedQuestions, setVisitedQuestions] =
        useState(() => new Set([0]));

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

            const nextQuestion =
                currentQuestion + 1;

            setCurrentQuestion(
                nextQuestion
            );

            setVisitedQuestions(
                (previous) => {

                    const updated =
                        new Set(previous);

                    updated.add(
                        nextQuestion
                    );

                    return updated;

                }
            );

        }

    };


    const handlePrevious = () => {

        if (currentQuestion > 0) {

            const previousQuestion =
                currentQuestion - 1;

            setCurrentQuestion(
                previousQuestion
            );

            setVisitedQuestions(
                (previous) => {

                    const updated =
                        new Set(previous);

                    updated.add(
                        previousQuestion
                    );

                    return updated;

                }
            );

        }

    };


    const handleQuestionNavigation = (
        questionIndex
    ) => {

        setCurrentQuestion(
            questionIndex
        );

        setVisitedQuestions(
            (previous) => {

                const updated =
                    new Set(previous);

                updated.add(
                    questionIndex
                );

                return updated;

            }
        );

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


    const answeredCount =
        Object.keys(answers).length;


    return (
        <DashboardLayout>

            <Box
                sx={{
                    maxWidth: 1280,
                    mx: "auto",
                    pr: {
                        xs: 0,
                        lg: 37
                    }
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

                {/* Fixed Question Palette */}

                <Box
                    sx={{
                        position: "fixed",
                        top: 104,
                        right: 24,
                        width: 250,
                        maxHeight: "calc(100vh - 128px)",
                        overflowY: "auto",
                        zIndex: 10,
                        display: {
                            xs: "none",
                            lg: "block"
                        }
                    }}
                >
                    <Card
                        elevation={2}
                        sx={{
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider"
                        }}
                    >
                        <CardContent
                            sx={{
                                p: 2.5,
                                "&:last-child": {
                                    pb: 2.5
                                }
                            }}
                        >

                            {/* Palette Header */}

                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >

                                <Box>

                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={700}
                                    >
                                        Questions
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Navigate through the quiz
                                    </Typography>

                                </Box>

                                <Box
                                    sx={{
                                        minWidth: 42,
                                        height: 30,
                                        px: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 1,
                                        bgcolor: "action.hover"
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        fontWeight={700}
                                    >
                                        {currentQuestion + 1}/
                                        {questions.length}
                                    </Typography>
                                </Box>

                            </Stack>


                            <Divider sx={{ my: 2 }} />


                            {/* Question Numbers */}

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(5, 1fr)",
                                    gap: 1
                                }}
                            >

                                {questions.map(
                                    (
                                        paletteQuestion,
                                        index
                                    ) => {

                                        const isCurrent =
                                            currentQuestion === index;

                                        const isAnswered =
                                            answers[
                                                paletteQuestion._id
                                            ] !== undefined;

                                        const isVisited =
                                            visitedQuestions.has(index);

                                        let backgroundColor =
                                            "background.paper";

                                        let textColor =
                                            "text.primary";

                                        let borderColor =
                                            "divider";

                                        if (isCurrent) {

                                            backgroundColor =
                                                "primary.main";

                                            textColor =
                                                "primary.contrastText";

                                            borderColor =
                                                "primary.main";

                                        } else if (isAnswered) {

                                            backgroundColor =
                                                "success.main";

                                            textColor =
                                                "success.contrastText";

                                            borderColor =
                                                "success.main";

                                        } else if (isVisited) {

                                            backgroundColor =
                                                "warning.main";

                                            textColor =
                                                "warning.contrastText";

                                            borderColor =
                                                "warning.main";

                                        }

                                        return (
                                            <Button
                                                key={
                                                    paletteQuestion._id
                                                }
                                                onClick={() =>
                                                    handleQuestionNavigation(
                                                        index
                                                    )
                                                }
                                                disableRipple
                                                sx={{
                                                    minWidth: 0,
                                                    width: 38,
                                                    height: 38,
                                                    p: 0,
                                                    mx: "auto",
                                                    borderRadius: 1,
                                                    border: "1px solid",
                                                    borderColor:
                                                        borderColor,
                                                    bgcolor:
                                                        backgroundColor,
                                                    color:
                                                        textColor,
                                                    fontSize:
                                                        "0.8rem",
                                                    fontWeight: 700,
                                                    lineHeight: 1,
                                                    boxShadow: "none",
                                                    "&:hover": {
                                                        bgcolor:
                                                            backgroundColor,
                                                        opacity: 0.85,
                                                        boxShadow:
                                                            "none"
                                                    }
                                                }}
                                            >
                                                {String(index + 1).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </Button>
                                        );

                                    }
                                )}

                            </Box>


                            <Divider sx={{ my: 2.5 }} />


                            {/* Status Legend */}

                            <Typography
                                variant="caption"
                                fontWeight={700}
                                color="text.secondary"
                                sx={{
                                    display: "block",
                                    mb: 1.5,
                                    letterSpacing: 0.5
                                }}
                            >
                                STATUS
                            </Typography>


                            <Stack spacing={1.25}>

                                {/* Current */}

                                <Stack
                                    direction="row"
                                    spacing={1.25}
                                    alignItems="center"
                                >

                                    <Box
                                        sx={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: "50%",
                                            bgcolor:
                                                "primary.main"
                                        }}
                                    />

                                    <Typography
                                        variant="caption"
                                    >
                                        Current
                                    </Typography>

                                </Stack>


                                {/* Answered */}

                                <Stack
                                    direction="row"
                                    spacing={1.25}
                                    alignItems="center"
                                >

                                    <Box
                                        sx={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: "50%",
                                            bgcolor:
                                                "success.main"
                                        }}
                                    />

                                    <Typography
                                        variant="caption"
                                    >
                                        Answered
                                    </Typography>

                                </Stack>


                                {/* Visited */}

                                <Stack
                                    direction="row"
                                    spacing={1.25}
                                    alignItems="center"
                                >

                                    <Box
                                        sx={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: "50%",
                                            bgcolor:
                                                "warning.main"
                                        }}
                                    />

                                    <Typography
                                        variant="caption"
                                    >
                                        Visited
                                    </Typography>

                                </Stack>


                                {/* Not Visited */}

                                <Stack
                                    direction="row"
                                    spacing={1.25}
                                    alignItems="center"
                                >

                                    <Box
                                        sx={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: "50%",
                                            bgcolor:
                                                "background.paper",
                                            border: "1px solid",
                                            borderColor:
                                                "divider"
                                        }}
                                    />

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Not Visited
                                    </Typography>

                                </Stack>

                            </Stack>

                        </CardContent>
                    </Card>
                </Box>
                   


                {/* Question Card */}

                <Card>

                    <CardContent
                        sx={{
                            p: {
                                xs: 0,
                                sm: 2
                            }
                        }}
                    >

                        <Stack spacing={2}>

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
                                    {question.marks ||
                                        0}{" "}
                                    {Number(
                                        question.marks ||
                                            0
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

                                {(
                                    question.options ||
                                    []
                                ).map(
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