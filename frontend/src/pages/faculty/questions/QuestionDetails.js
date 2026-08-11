import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Typography,
} from "@mui/material";

import { useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import questionService from "../../../services/questionService";


const QuestionDetails = () => {

    const { id } = useParams();

    const [question, setQuestion] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchQuestion = async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await questionService.getQuestionById(id);

                console.log(
                    "Question fetched:",
                    response
                );

                setQuestion(response.data);

            } catch (error) {

                console.error(
                    "Failed to fetch question:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load question"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchQuestion();

    }, [id]);


    if (loading) {

        return (

            <DashboardLayout>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 300,
                    }}
                >
                    <CircularProgress />
                </Box>

            </DashboardLayout>

        );

    }


    if (error) {

        return (

            <DashboardLayout>

                <Alert severity="error">
                    {error}
                </Alert>

            </DashboardLayout>

        );

    }


    if (!question) {

        return (

            <DashboardLayout>

                <Alert severity="warning">
                    Question not found.
                </Alert>

            </DashboardLayout>

        );

    }


    return (

        <DashboardLayout>

            <Box>

                {/* Header */}

                <Box sx={{ mb: 3 }}>

                    <Typography
                        variant="h4"
                        fontWeight={600}
                    >
                        Question Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        View question information
                    </Typography>

                </Box>


                {/* Basic Information */}

                <Card sx={{ mb: 3 }}>

                    <CardContent>

                        <Typography
                            variant="h5"
                            fontWeight={600}
                            gutterBottom
                        >
                            {question.title}
                        </Typography>


                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            {question.code}
                        </Typography>


                        <Box
                            sx={{
                                display: "flex",
                                gap: 1,
                                flexWrap: "wrap",
                                mb: 2,
                            }}
                        >

                            <Chip
                                label={question.questionType}
                                color={
                                    question.questionType === "MCQ"
                                        ? "primary"
                                        : "secondary"
                                }
                            />

                            <Chip
                                label={question.difficulty}
                                variant="outlined"
                            />

                            <Chip
                                label={question.status}
                                color={
                                    question.status === "ACTIVE"
                                        ? "success"
                                        : "default"
                                }
                            />

                        </Box>


                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Topic
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{ mb: 2 }}
                        >
                            {question.topic?.name || "-"}
                        </Typography>


                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Description
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                mt: 0.5,
                                whiteSpace: "pre-line",
                            }}
                        >
                            {question.description || "-"}
                        </Typography>

                    </CardContent>

                </Card>


                {/* Coding Question */}

                {question.questionType === "CODING" && (

                    <>

                        {/* Constraints */}

                        <Card sx={{ mb: 3 }}>

                            <CardContent>

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    gutterBottom
                                >
                                    Constraints
                                </Typography>

                                {question.constraints?.length > 0 ? (

                                    <Box component="ul" sx={{ mt: 1 }}>

                                        {question.constraints.map(
                                            (constraint, index) => (

                                                <li key={index}>

                                                    <Typography>
                                                        {constraint}
                                                    </Typography>

                                                </li>

                                            )
                                        )}

                                    </Box>

                                ) : (

                                    <Typography
                                        color="text.secondary"
                                    >
                                        No constraints specified.
                                    </Typography>

                                )}

                            </CardContent>

                        </Card>


                        {/* Input / Output */}

                        <Card sx={{ mb: 3 }}>

                            <CardContent>

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    gutterBottom
                                >
                                    Input Format
                                </Typography>

                                <Typography
                                    sx={{
                                        whiteSpace: "pre-line",
                                        mb: 3,
                                    }}
                                >
                                    {question.inputFormat || "-"}
                                </Typography>


                                <Divider sx={{ mb: 3 }} />


                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    gutterBottom
                                >
                                    Output Format
                                </Typography>

                                <Typography
                                    sx={{
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                    {question.outputFormat || "-"}
                                </Typography>

                            </CardContent>

                        </Card>


                        {/* Coding Configuration */}

                        <Card sx={{ mb: 3 }}>

                            <CardContent>

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    gutterBottom
                                >
                                    Coding Configuration
                                </Typography>


                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                        flexWrap: "wrap",
                                        mb: 3,
                                    }}
                                >

                                    {question.allowedLanguages?.map(
                                        (language) => (

                                            <Chip
                                                key={language}
                                                label={language}
                                                variant="outlined"
                                            />

                                        )
                                    )}

                                </Box>


                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 6,
                                    }}
                                >

                                    <Box>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Execution Time
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {question.executionTimeLimit} ms
                                        </Typography>

                                    </Box>


                                    <Box>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Memory Limit
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {question.memoryLimit} MB
                                        </Typography>

                                    </Box>

                                </Box>

                            </CardContent>

                        </Card>

                    </>

                )}


                {/* MCQ Question */}

                {question.questionType === "MCQ" && (

                    <>

                        {/* Options */}

                        <Card sx={{ mb: 3 }}>

                            <CardContent>

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    gutterBottom
                                >
                                    Options
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1.5,
                                    }}
                                >

                                    {question.options?.map(
                                        (option) => (

                                            <Box
                                                key={option._id}
                                                sx={{
                                                    display: "flex",
                                                    gap: 2,
                                                    alignItems: "center",
                                                    p: 1.5,
                                                    border: 1,
                                                    borderColor: "divider",
                                                    borderRadius: 1,
                                                }}
                                            >

                                                <Chip
                                                    label={option.key}
                                                    size="small"
                                                />

                                                <Typography>
                                                    {option.text}
                                                </Typography>

                                            </Box>

                                        )
                                    )}

                                </Box>

                            </CardContent>

                        </Card>


                        {/* Answer */}

                        <Card sx={{ mb: 3 }}>

                            <CardContent>

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    gutterBottom
                                >
                                    Correct Answer
                                </Typography>

                                <Chip
                                    label={
                                        question.correctAnswer || "-"
                                    }
                                    color="success"
                                />


                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    sx={{ mt: 3 }}
                                    gutterBottom
                                >
                                    Explanation
                                </Typography>

                                <Typography
                                    sx={{
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                    {question.explanation || "-"}
                                </Typography>

                            </CardContent>

                        </Card>

                    </>

                )}

            </Box>

        </DashboardLayout>

    );

};

export default QuestionDetails;