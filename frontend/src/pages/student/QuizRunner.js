import { useEffect, useMemo, useState,useRef } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    LinearProgress,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import assessmentService from "../../services/assessmentService";
import quizSessionService from "../../services/quizSessionService";

const QuizRunner = () => {

    const navigate = useNavigate();
    const { sessionId } = useParams();

    const [session, setSession] = useState(null);

    const [assessment, setAssessment] = useState(null);

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

    const [submittedQuestions, setSubmittedQuestions] =
        useState(new Set());

    const [attemptId, setAttemptId] =
        useState(null);

    const [submitting, setSubmitting] =
        useState(false);

    const [quizScore, setQuizScore] =
        useState({
            totalPoints: 0,
            currentStreak: 0,
            longestStreak: 0
        });

    const [finishDialogOpen, setFinishDialogOpen] =
        useState(false);

    const [finishingQuiz, setFinishingQuiz] =
        useState(false);

    const [finishError, setFinishError] =
        useState("");

        const [deadlineAt, setDeadlineAt] = useState(null);
        const [timeLeftMs, setTimeLeftMs] = useState(null);
        const [autoSubmitting, setAutoSubmitting] = useState(false);

        const timeoutHandledRef = useRef(false);
    /*
     * =========================================================
     * LOAD QUIZ
     * =========================================================
     */

    useEffect(() => {

        const loadQuiz = async () => {

            try {

                setLoading(true);
                setError("");

                const sessionResponse =
                    await quizSessionService.getQuizSessionById(
                        sessionId
                    );

                const sessionData =
                    sessionResponse.data;

                if (sessionData.studentAttempt) {

                    setAttemptId(
                        sessionData.studentAttempt._id
                    );

                    /*
                     * Restore server-side attempt information.
                     */
                    setQuizScore({
                        totalPoints:
                            sessionData.studentAttempt.totalPoints ||
                            0,

                        currentStreak:
                            sessionData.studentAttempt.currentStreak ||
                            0,

                        longestStreak:
                            sessionData.studentAttempt.longestStreak ||
                            0
                    });

                    /*
                     * If the attempt has already been submitted,
                     * do not allow the student to enter the runner again.
                     */
                    if (
                        sessionData.studentAttempt.status ===
                        "SUBMITTED"
                    ) {

                        navigate(
                            `/student/quiz/${sessionId}/result`
                        );

                        return;
                    }

                    if (
                        sessionData.studentAttempt.status ===
                        "TIMED_OUT"
                    ) {

                        // setError(
                        //     "Your quiz attempt has timed out."
                        // );
                         navigate(`/student/quiz/${sessionId}/result`, {
                            replace: true
                        });

                        return;
                    }
                }

                setSession(sessionData);

                if (sessionData.status !== "LIVE") {

                    setError(
                        "This quiz is not currently live."
                    );

                    return;
                }
                const startedAtMs = new Date(sessionData.startedAt).getTime();
                const durationMs = Number(sessionData.duration || 0) * 60 * 1000;

                if (Number.isFinite(startedAtMs) && durationMs > 0) {
                    const calculatedDeadline = startedAtMs + durationMs;

                    setDeadlineAt(calculatedDeadline);
                    setTimeLeftMs(Math.max(calculatedDeadline - Date.now(), 0));
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
                    await assessmentService.getAssessmentById(
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

    }, [sessionId, navigate]);

    useEffect(() => {
    if (!deadlineAt) {
        return;
    }

    const updateTimer = () => {
        const remaining = Math.max(deadlineAt - Date.now(), 0);
        setTimeLeftMs(remaining);
    };

    updateTimer();

    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
}, [deadlineAt]);

useEffect(() => {
    if (
        timeLeftMs !== 0 ||
        timeoutHandledRef.current ||
        !attemptId ||
        !sessionId
    ) {
        return;
    }

    if (submitting) {
        return;
    }

    timeoutHandledRef.current = true;

    const submitTimedOutAttempt = async () => {
        try {
            setAutoSubmitting(true);

            await quizSessionService.submitQuizAttempt(sessionId);

            navigate(`/student/quiz/${sessionId}/result`, {
                replace: true
            });
        } catch (error) {
            console.error("Failed to submit timed-out quiz:", error);

            setError(
                error.response?.data?.message ||
                "Time is up, but the quiz could not be submitted. Please try again."
            );
        } finally {
            setAutoSubmitting(false);
        }
    };

    submitTimedOutAttempt();
}, [timeLeftMs, attemptId, sessionId, submitting, navigate]);
    /*
     * =========================================================
     * FLATTEN QUESTIONS
     * =========================================================
     */

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
                    assessmentQuestionId:
                        item._id,
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


    /*
     * =========================================================
     * ANSWER SELECTION
     * =========================================================
     */

    const handleAnswerSelect = (
        optionIndex
    ) => {

        if (!question || autoSubmitting) {
            return;
        }

        /*
         * Do not allow modification after the
         * answer has already been submitted.
         */
        if (
            submittedQuestions.has(
                question._id
            )
        ) {
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


    /*
     * =========================================================
     * NEXT QUESTION
     * =========================================================
     */

    const handleNext = async () => {

        const submitted =
            await submitCurrentAnswer();

        if (!submitted) {
            return;
        }

        if (
            currentQuestion <
            questions.length - 1
        ) {

            const nextQuestion =
                currentQuestion + 1;

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

            setCurrentQuestion(
                nextQuestion
            );

        }

    };


    /*
     * =========================================================
     * PREVIOUS QUESTION
     * =========================================================
     */

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


    /*
     * =========================================================
     * QUESTION PALETTE NAVIGATION
     * =========================================================
     */

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


    /*
     * =========================================================
     * SUBMIT CURRENT ANSWER
     * =========================================================
     */

    const submitCurrentAnswer = async () => {

        const question =
            questions[currentQuestion];

        if (
            !question ||
            !attemptId
        ) {
            return true;
        }

        if (
            submittedQuestions.has(
                question._id
            )
        ) {
            return true;
        }

        const selectedIndex =
            answers[question._id];

        /*
         * No answer selected.
         *
         * We allow the student to move forward
         * without creating a QuizResponse.
         */
        if (
            selectedIndex === undefined
        ) {
            return true;
        }

        const selectedOption =
            question.options?.[
                selectedIndex
            ];

        if (!selectedOption?.key) {
            return true;
        }

        try {

            setSubmitting(true);

            const response =
                await quizSessionService.submitQuizResponse({
                    sessionId,
                    attemptId,
                    assessmentQuestionId:
                        question.assessmentQuestionId,
                    selectedAnswer:
                        selectedOption.key
                });

            const result =
                response.data;

            setSubmittedQuestions(
                (previous) => {

                    const updated =
                        new Set(previous);

                    updated.add(
                        question._id
                    );

                    return updated;

                }
            );

            setQuizScore(
                (previous) => ({
                    totalPoints:
                        previous.totalPoints +
                        (result.pointsEarned || 0),

                    currentStreak:
                        result.currentStreak || 0,

                    longestStreak:
                        result.longestStreak || 0
                })
            );

            return true;

        } catch (error) {

            console.error(
                "Failed to submit quiz answer:",
                error
            );

            /*
             * If the server says the attempt has
             * expired, stop the normal runner flow.
             */
            if (
                error.response?.status === 400 ||
                error.response?.status === 409
            ) {

                setError(
                    error.response?.data?.message ||
                    "Unable to submit your answer."
                );

            }

            return false;

        } finally {

            setSubmitting(false);

        }

    };


    /*
     * =========================================================
     * OPEN FINISH DIALOG
     * =========================================================
     */

    const handleOpenFinishDialog = async () => {

        /*
         * If the current question has an answer,
         * make sure it is submitted before showing
         * the final confirmation.
         */
        const submitted =
            await submitCurrentAnswer();

        if (!submitted) {
            return;
        }

        setFinishError("");
        setFinishDialogOpen(true);

    };


    /*
     * =========================================================
     * CLOSE FINISH DIALOG
     * =========================================================
     */

    const handleCloseFinishDialog = () => {

        if (finishingQuiz) {
            return;
        }

        setFinishDialogOpen(false);
        setFinishError("");

    };


    /*
     * =========================================================
     * FINAL QUIZ SUBMISSION
     * =========================================================
     */

    const handleFinishQuiz = async () => {

        if (
            !sessionId ||
            !attemptId
        ) {
            return;
        }

        try {

            setFinishingQuiz(true);
            setFinishError("");

            /*
             * Submit the complete attempt.
             */
            await quizSessionService.submitQuizAttempt(
                sessionId
            );

            setFinishDialogOpen(false);

            /*
             * Move the student to the result page.
             */
            navigate(
                `/student/quiz/${sessionId}/result`,
                {
                    replace: true
                }
            );

        } catch (error) {

            console.error(
                "Failed to submit quiz:",
                error
            );

            setFinishError(
                error.response?.data?.message ||
                "Failed to submit the quiz. Please try again."
            );

        } finally {

            setFinishingQuiz(false);

        }

    };


    /*
     * =========================================================
     * LOADING
     * =========================================================
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
     * =========================================================
     * ERROR
     * =========================================================
     */

    if (
        error ||
        !assessment
    ) {

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


    /*
     * =========================================================
     * EMPTY QUIZ
     * =========================================================
     */

    if (
        questions.length === 0
    ) {

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


    /*
     * =========================================================
     * QUIZ CALCULATIONS
     * =========================================================
     */

    const progress =
        ((currentQuestion + 1) /
            questions.length) *
        100;

    const answeredCount =
        Object.keys(answers).length;

    const unansweredCount =
        Math.max(
            questions.length -
            answeredCount,
            0
        );

    const isLastQuestion =
        currentQuestion ===
        questions.length - 1;

const formatTimeLeft = (milliseconds) => {
    if (milliseconds === null) {
        return "--:--";
    }

    const totalSeconds = Math.ceil(
        Math.max(milliseconds, 0) / 1000
    );

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const timerIsCritical =
    timeLeftMs !== null && timeLeftMs <= 60 * 1000;
    /*
     * =========================================================
     * RENDER
     * =========================================================
     */

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

                {/* =================================================
                    QUIZ HEADER
                ================================================= */}

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

                    <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                >
                    <Typography
                        fontWeight={600}
                    >
                        Question{" "}
                        {currentQuestion + 1}{" "}
                        of {questions.length}
                    </Typography>

                    <Chip
                        icon={<AccessTimeIcon />}
                        label={`Time ${formatTimeLeft(timeLeftMs)}`}
                        color={timerIsCritical ? "error" : "default"}
                        variant={
                            timerIsCritical
                                ? "filled"
                                : "outlined"
                        }
                        sx={{
                            fontWeight: 700,
                            minWidth: 105
                        }}
                    />

                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleOpenFinishDialog}
                        disabled={
                            submitting ||
                            finishingQuiz ||
                            autoSubmitting
                        }
                    >
                        Finish Quiz
                    </Button>
                </Stack>

                </Stack>


                {/* =================================================
                    PROGRESS
                ================================================= */}

                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        mb: 3
                    }}
                />

                {autoSubmitting && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        Time is up. Submitting your quiz automatically...
                    </Alert>
                )}


                {/* =================================================
                    FIXED QUESTION PALETTE
                ================================================= */}

                <Box
                    sx={{
                        position: "fixed",
                        top: 104,
                        right: 24,
                        width: 250,
                        maxHeight:
                            "calc(100vh - 128px)",
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
                                        bgcolor:
                                            "action.hover"
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


                            <Divider
                                sx={{ my: 2 }}
                            />


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
                                            currentQuestion ===
                                            index;

                                        const isAnswered =
                                            answers[
                                                paletteQuestion._id
                                            ] !== undefined;

                                        const isVisited =
                                            visitedQuestions.has(
                                                index
                                            );

                                        let backgroundColor =
                                            "background.paper";

                                        let textColor =
                                            "text.primary";

                                        let borderColor =
                                            "divider";

                                        if (
                                            isCurrent
                                        ) {

                                            backgroundColor =
                                                "primary.main";

                                            textColor =
                                                "primary.contrastText";

                                            borderColor =
                                                "primary.main";

                                        } else if (
                                            isAnswered
                                        ) {

                                            backgroundColor =
                                                "success.main";

                                            textColor =
                                                "success.contrastText";

                                            borderColor =
                                                "success.main";

                                        } else if (
                                            isVisited
                                        ) {

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
                                                disabled ={autoSubmitting}
                                                disableRipple
                                                sx={{
                                                    minWidth: 0,
                                                    width: 38,
                                                    height: 38,
                                                    p: 0,
                                                    mx: "auto",
                                                    borderRadius: 1,
                                                    border: "1px solid",
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
                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </Button>
                                        );

                                    }
                                )}

                            </Box>


                            <Divider
                                sx={{ my: 2.5 }}
                            />


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


                {/* =================================================
                    QUESTION CARD
                ================================================= */}

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

                                        const isSubmitted =
                                            submittedQuestions.has(
                                                question._id
                                            );

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
                                                        isSubmitted
                                                            ? "default"
                                                            : "pointer",
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
                                                    opacity:
                                                        isSubmitted &&
                                                        !selected
                                                            ? 0.7
                                                            : 1,
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


                            {/* =================================================
                                NAVIGATION
                            ================================================= */}

                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row"
                                }}
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
                                            0 ||
                                        submitting|| autoSubmitting
                                    }
                                    onClick={
                                        handlePrevious
                                    }
                                >
                                    Previous
                                </Button>


                                {!isLastQuestion ? (

                                    <Button
                                        variant="contained"
                                        endIcon={
                                            <ArrowForwardIcon />
                                        }
                                        disabled={
                                            submitting ||
                                            finishingQuiz||
                                            autoSubmitting
                                        }
                                        onClick={
                                            handleNext
                                        }
                                    >
                                        {submitting
                                            ? "Submitting"
                                            : "Next"}
                                    </Button>

                                ) : (

                                    <Button
                                        variant="contained"
                                        color="success"
                                       
                                        disabled={
                                            submitting || finishingQuiz|| autoSubmitting
                                        }
                                        onClick={
                                            handleOpenFinishDialog
                                        }
                                    >
                                        Finish Quiz
                                    </Button>

                                )}

                            </Stack>

                        </Stack>

                    </CardContent>

                </Card>

            </Box>


            {/* =========================================================
                FINISH QUIZ DIALOG
            ========================================================= */}

            <Dialog
                open={finishDialogOpen}
                onClose={
                    handleCloseFinishDialog
                }
                fullWidth
                maxWidth="sm"
            >

                <DialogTitle>
                    Submit Quiz?
                </DialogTitle>

                <DialogContent>

                    <Stack spacing={2}>

                        <Typography>
                            You are about to submit your
                            quiz. Once submitted, you will
                            not be able to change your answers.
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={2}
                        >

                            <Card
                                variant="outlined"
                                sx={{
                                    flex: 1
                                }}
                            >

                                <CardContent>

                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                    >
                                        {answeredCount}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Answered
                                    </Typography>

                                </CardContent>

                            </Card>


                            <Card
                                variant="outlined"
                                sx={{
                                    flex: 1
                                }}
                            >

                                <CardContent>

                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                    >
                                        {unansweredCount}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Unanswered
                                    </Typography>

                                </CardContent>

                            </Card>

                        </Stack>


                        {unansweredCount > 0 && (

                            <Alert severity="warning">

                                You still have{" "}
                                <strong>
                                    {unansweredCount}
                                </strong>{" "}
                                unanswered{" "}
                                {unansweredCount === 1
                                    ? "question"
                                    : "questions"}
                                . Unanswered questions
                                will receive no points.

                            </Alert>

                        )}


                        {finishError && (

                            <Alert severity="error">
                                {finishError}
                            </Alert>

                        )}

                    </Stack>

                </DialogContent>


                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2
                    }}
                >

                    <Button
                        onClick={
                            handleCloseFinishDialog
                        }
                        disabled={
                            finishingQuiz
                        }
                    >
                        Continue Quiz
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        startIcon={finishingQuiz?"SUBMITTING":"SUBMIT QUIZ"}
                        onClick={
                            handleFinishQuiz
                        }
                        disabled={
                            finishingQuiz|| autoSubmitting
                        }
                    >
                        {finishingQuiz
                            ? "Submitting..."
                            : "Submit Quiz"}
                    </Button>

                </DialogActions>

            </Dialog>

        </DashboardLayout>
    );

};

export default QuizRunner;