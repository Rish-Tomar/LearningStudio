import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    Typography
} from "@mui/material";

// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import quizSessionService from "../../services/quizSessionService";

const QuizResult = () => {

    const navigate = useNavigate();
    const { sessionId } = useParams();

    const [session, setSession] = useState(null);
    const [result, setResult] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const loadResult = async () => {

            try {

                setLoading(true);
                setError("");

                /*
                 * Fetch the session again.
                 *
                 * The backend now returns the student's
                 * own attempt as studentAttempt.
                 */
                const response =
                    await quizSessionService.getQuizSessionById(
                        sessionId
                    );

                const sessionData =
                    response.data;

                setSession(sessionData);

                const studentAttempt =
                    sessionData.studentAttempt;

                if (!studentAttempt) {

                    setError(
                        "Your quiz attempt could not be found."
                    );

                    return;

                }

                if (
                    studentAttempt.status !==
                    "SUBMITTED"
                ) {

                    setError(
                        "This quiz has not been submitted yet."
                    );

                    return;

                }

                setResult({
                    attemptedQuestions:
                        studentAttempt.attemptedQuestions ||
                        0,

                    correctAnswers:
                        studentAttempt.correctAnswers ||
                        0,

                    totalPoints:
                        studentAttempt.totalPoints ||
                        0,

                    currentStreak:
                        studentAttempt.currentStreak ||
                        0,

                    longestStreak:
                        studentAttempt.longestStreak ||
                        0
                });

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

    if (error || !result) {

        return (
            <DashboardLayout>

                <Box
                    sx={{
                        maxWidth: 900,
                        mx: "auto",
                        mt: 4
                    }}
                >

                    <Alert severity="error">
                        {error ||
                            "Quiz result is unavailable."}
                    </Alert>

                    <Button
                        sx={{ mt: 2 }}
                        startIcon={
                            <HomeOutlinedIcon />
                        }
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


    /*
     * =========================================================
     * CALCULATIONS
     * =========================================================
     */

    const totalQuestions =
        session?.assessment?.questionsCount ||
        session?.assessment?.totalQuestions ||
        null;

    /*
     * The current backend response does not provide
     * totalQuestions, so use attempted + unanswered
     * only when that information is available.
     *
     * For now, accuracy is based on attempted questions.
     */
    const accuracy =
        result.attemptedQuestions > 0
            ? Math.round(
                (result.correctAnswers /
                    result.attemptedQuestions) *
                100
            )
            : 0;


    /*
     * =========================================================
     * RESULT UI
     * =========================================================
     */

    return (
        <DashboardLayout>

            <Box
                sx={{
                    maxWidth: 1000,
                    mx: "auto",
                    py: 4
                }}
            >

                {/* =================================================
                    SUCCESS HEADER
                ================================================= */}

                <Card
                    sx={{
                        mb: 3,
                        textAlign: "center",
                        borderRadius: 3
                    }}
                >

                    <CardContent
                        sx={{
                            py: 5
                        }}
                    >

                        <Typography
                            color="success.main"
                            sx={{
                                fontSize: 64,
                                fontWeight: 700,
                                lineHeight: 1,
                                mb: 2
                            }}
                        >
                            ✓
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            Quiz Submitted!
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            {session?.assessment?.title ||
                                "Quiz"}
                        </Typography>

                    </CardContent>

                </Card>


                {/* =================================================
                    SCORE
                ================================================= */}

                <Card
                    sx={{
                        mb: 3,
                        borderRadius: 3
                    }}
                >

                    <CardContent
                        sx={{
                            py: 4
                        }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{ mb: 3 }}
                        >
                            Your Performance
                        </Typography>


                        <Grid
                            container
                            spacing={2}
                        >

                            {/* Points */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                            >

                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: "100%"
                                    }}
                                >

                                    <CardContent>

                                        <Typography
                                            variant="h3"
                                            fontWeight={700}
                                        >
                                            {
                                                result.totalPoints
                                            }
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                        >
                                            Points
                                        </Typography>

                                    </CardContent>

                                </Card>

                            </Grid>


                            {/* Correct */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                            >

                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: "100%"
                                    }}
                                >

                                    <CardContent>

                                        <Typography
                                            variant="h3"
                                            fontWeight={700}
                                        >
                                            {
                                                result.correctAnswers
                                            }
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                        >
                                            Correct
                                        </Typography>

                                    </CardContent>

                                </Card>

                            </Grid>


                            {/* Attempted */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                            >

                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: "100%"
                                    }}
                                >

                                    <CardContent>

                                        <Typography
                                            variant="h3"
                                            fontWeight={700}
                                        >
                                            {
                                                result.attemptedQuestions
                                            }
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                        >
                                            Attempted
                                        </Typography>

                                    </CardContent>

                                </Card>

                            </Grid>


                            {/* Accuracy */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                            >

                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: "100%"
                                    }}
                                >

                                    <CardContent>

                                        <Typography
                                            variant="h3"
                                            fontWeight={700}
                                        >
                                            {accuracy}%
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                        >
                                            Accuracy
                                        </Typography>

                                    </CardContent>

                                </Card>

                            </Grid>

                        </Grid>

                    </CardContent>

                </Card>


                {/* =================================================
                    STREAK
                ================================================= */}

                <Card
                    sx={{
                        mb: 3,
                        borderRadius: 3
                    }}
                >

                    <CardContent>

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row"
                            }}
                            spacing={3}
                            alignItems={{
                                xs: "flex-start",
                                sm: "center"
                            }}
                        >

                            <EmojiEventsOutlinedIcon
                                sx={{
                                    fontSize: 52
                                }}
                            />

                            <Box
                                sx={{
                                    flex: 1
                                }}
                            >

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    Streak Performance
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Keep building your streak
                                    in future quizzes.
                                </Typography>

                            </Box>


                            <Stack
                                direction="row"
                                spacing={4}
                            >

                                <Box>

                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                    >
                                        {
                                            result.currentStreak
                                        }
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Final Streak
                                    </Typography>

                                </Box>


                                <Divider
                                    orientation="vertical"
                                    flexItem
                                />


                                <Box>

                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                    >
                                        {
                                            result.longestStreak
                                        }
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Longest Streak
                                    </Typography>

                                </Box>

                            </Stack>

                        </Stack>

                    </CardContent>

                </Card>


                {/* =================================================
                    INFORMATION
                ================================================= */}

                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                >
                    Your quiz attempt has been successfully
                    recorded.
                </Alert>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row"
                    }}
                    justifyContent="center"
                    spacing={2}
                >

                    <Button
                        variant="contained"
                        startIcon={
                            <HomeOutlinedIcon />
                        }
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