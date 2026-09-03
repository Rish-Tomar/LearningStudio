import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PublishIcon from "@mui/icons-material/Publish";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import QuizIcon from "@mui/icons-material/Quiz";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import assessmentService from "../../../services/assessmentService";


const getStatusColor = (status) => {
    switch (status) {
        case "PUBLISHED":
            return "success";

        case "CLOSED":
            return "default";

        case "DRAFT":
        default:
            return "warning";
    }
};


const formatDateTime = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleString();
};


const AssessmentPreview = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [assessment, setAssessment] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [publishing, setPublishing] =
        useState(false);


    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await assessmentService
                        .getAssessmentById(id);

                setAssessment(
                    response.data
                );
            } catch (error) {
                console.error(
                    "Failed to load assessment:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load assessment"
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAssessment();
        }
    }, [id]);


    const questions = useMemo(() => {
        if (!assessment?.sections) {
            return [];
        }

        return assessment.sections
            .flatMap(
                (section) =>
                    section.questions || []
            )
            .sort(
                (a, b) =>
                    Number(a.order || 0) -
                    Number(b.order || 0)
            );
    }, [assessment]);


    const totalMarks = useMemo(() => {
        return questions.reduce(
            (total, item) =>
                total +
                Number(item.marks || 0),
            0
        );
    }, [questions]);


    const handlePublish = async () => {
        try {
            setPublishing(true);
            setError("");

            const response =
                await assessmentService
                    .publishAssessment(id);

            setAssessment(
                response.data
            );
        } catch (error) {
            console.error(
                "Failed to publish assessment:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to publish assessment"
            );
        } finally {
            setPublishing(false);
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


    if (!assessment) {
        return (
            <DashboardLayout>
                <Alert severity="error">
                    {error ||
                        "Assessment not found"}
                </Alert>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout>
            <Box
                sx={{
                    maxWidth: 1200,
                    mx: "auto"
                }}
            >

                {/* Header */}

                <Stack
                    direction={{
                        xs: "column",
                        md: "row"
                    }}
                    justifyContent="space-between"
                    alignItems={{
                        xs: "flex-start",
                        md: "center"
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
                                    "/faculty/assessments"
                                )
                            }
                            sx={{ mb: 1 }}
                        >
                            Back to Assessments
                        </Button>

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                        >
                            <QuizIcon
                                color="primary"
                                fontSize="large"
                            />

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                {assessment.title}
                            </Typography>
                        </Stack>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.75 }}
                        >
                            Assessment Preview
                        </Typography>
                    </Box>


                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row"
                        }}
                        spacing={1}
                    >

                        {assessment.status ===
                            "DRAFT" && (
                            <>
                                <Button
                                    variant="outlined"
                                    startIcon={
                                        <EditIcon />
                                    }
                                    onClick={() =>
                                        navigate(
                                            `/faculty/assessments/${id}/edit`
                                        )
                                    }
                                >
                                    Edit
                                </Button>

                                <Button
                                    variant="contained"
                                    startIcon={
                                        <PublishIcon />
                                    }
                                    disabled={
                                        publishing ||
                                        questions.length === 0
                                    }
                                    onClick={
                                        handlePublish
                                    }
                                >
                                    {publishing
                                        ? "Publishing..."
                                        : "Publish"}
                                </Button>
                            </>
                        )}


                        {assessment.status ===
                            "PUBLISHED" && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={
                                    <PlayArrowIcon />
                                }
                                onClick={() =>
                                    navigate(
                                        `/faculty/assessments/${id}/host`
                                    )
                                }
                            >
                                Host Live
                            </Button>
                        )}

                    </Stack>

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


                {/* Assessment Summary */}

                <Card sx={{ mb: 3 }}>
                    <CardContent>

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            spacing={2}
                            sx={{ mb: 2 }}
                        >
                            <Box>
                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                >
                                    {assessment.title}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                >
                                    {assessment.description ||
                                        "No description provided."}
                                </Typography>
                            </Box>

                            <Chip
                                label={
                                    assessment.status
                                }
                                color={getStatusColor(
                                    assessment.status
                                )}
                            />
                        </Stack>


                        <Divider
                            sx={{ mb: 2 }}
                        />


                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row"
                            }}
                            spacing={{
                                xs: 1.5,
                                sm: 4
                            }}
                            flexWrap="wrap"
                        >

                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >
                                <AccessTimeIcon
                                    color="action"
                                    fontSize="small"
                                />

                                <Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Duration
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                    >
                                        {
                                            assessment.duration
                                        }{" "}
                                        minutes
                                    </Typography>
                                </Box>
                            </Stack>


                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >
                                <QuestionAnswerIcon
                                    color="action"
                                    fontSize="small"
                                />

                                <Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Questions
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                    >
                                        {
                                            questions.length
                                        }
                                    </Typography>
                                </Box>
                            </Stack>


                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >
                                <EmojiEventsIcon
                                    color="action"
                                    fontSize="small"
                                />

                                <Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Total Marks
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                    >
                                        {totalMarks}
                                    </Typography>
                                </Box>
                            </Stack>


                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Quiz Code
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                >
                                    {assessment.code}
                                </Typography>
                            </Box>

                        </Stack>


                        <Divider
                            sx={{ my: 2 }}
                        />


                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row"
                            }}
                            spacing={{
                                xs: 1,
                                sm: 4
                            }}
                        >

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Available From
                                </Typography>

                                <Typography
                                    variant="body2"
                                >
                                    {formatDateTime(
                                        assessment.startAt
                                    )}
                                </Typography>
                            </Box>


                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Available Until
                                </Typography>

                                <Typography
                                    variant="body2"
                                >
                                    {formatDateTime(
                                        assessment.endAt
                                    )}
                                </Typography>
                            </Box>

                        </Stack>

                    </CardContent>
                </Card>


                {/* Questions */}

                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                >
                    Questions
                </Typography>


                {questions.length === 0 && (
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 4,
                            textAlign: "center"
                        }}
                    >
                        <Typography
                            color="text.secondary"
                        >
                            No questions have been
                            added to this assessment.
                        </Typography>
                    </Paper>
                )}


                <Stack spacing={2}>

                    {questions.map(
                        (item, index) => {
                            const question =
                                item.question;

                            return (
                                <Card
                                    key={
                                        item._id ||
                                        question?._id ||
                                        index
                                    }
                                >
                                    <CardContent>

                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            spacing={2}
                                        >

                                            <Typography
                                                variant="subtitle1"
                                                fontWeight={700}
                                            >
                                                Question{" "}
                                                {index + 1}
                                            </Typography>

                                            <Chip
                                                label={`${item.marks || 0} ${
                                                    Number(
                                                        item.marks || 0
                                                    ) === 1
                                                        ? "mark"
                                                        : "marks"
                                                }`}
                                                size="small"
                                            />

                                        </Stack>


                                        <Typography
                                            sx={{
                                                mt: 1.5,
                                                whiteSpace:
                                                    "pre-wrap"
                                            }}
                                        >
                                            {question?.title ||
                                                question?.question ||
                                                "Question text unavailable"}
                                        </Typography>


                                        {question?.options &&
                                            question.options
                                                .length > 0 && (
                                                <Stack
                                                    spacing={1}
                                                    sx={{
                                                        mt: 2
                                                    }}
                                                >
                                                    {question.options.map(
                                                        (
                                                            option,
                                                            optionIndex
                                                        ) => (
                                                            <Paper
                                                                key={
                                                                    optionIndex
                                                                }
                                                                variant="outlined"
                                                                sx={{
                                                                    p: 1.25
                                                                }}
                                                            >
                                                                <Typography>
                                                                    {String.fromCharCode(
                                                                        65 +
                                                                            optionIndex
                                                                    )}
                                                                    .{" "}
                                                                    {typeof option ===
                                                                    "string"
                                                                        ? option
                                                                        : option.text ||
                                                                          option.label ||
                                                                          ""}
                                                                </Typography>
                                                            </Paper>
                                                        )
                                                    )}
                                                </Stack>
                                            )}

                                    </CardContent>
                                </Card>
                            );
                        }
                    )}

                </Stack>

            </Box>
        </DashboardLayout>
    );
};


export default AssessmentPreview;