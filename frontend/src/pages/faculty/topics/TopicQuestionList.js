import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import questionService
    from "../../../services/questionService";

const TopicQuestionList = () => {

    const { topicId } = useParams();

    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        const fetchQuestions = async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await questionService.getQuestionsByTopic(
                        topicId
                    );

                setQuestions(
                    response.data || []
                );

            } catch (error) {

                console.error(
                    "Failed to fetch topic questions:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load questions"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchQuestions();

    }, [topicId]);

    const handleCreateQuestion = () => {

        navigate(
            `/faculty/questions/create?topic=${topicId}`
        );

    };

    return (

        <DashboardLayout>

            <Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >

                    <Box>

                        <Typography
                            variant="h4"
                            fontWeight={600}
                        >
                            Questions
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Questions associated with this topic
                        </Typography>

                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateQuestion}
                    >
                        Create Question
                    </Button>

                </Box>

                {loading && (

                    <Typography>
                        Loading questions...
                    </Typography>

                )}

                {error && (

                    <Alert severity="error">
                        {error}
                    </Alert>

                )}

                {!loading &&
                    !error &&
                    questions.length === 0 && (

                        <Alert severity="info">
                            No questions have been added to this topic yet.
                        </Alert>

                    )}

                {!loading &&
                    !error &&
                    questions.length > 0 && (

                        <Box>

                            {questions.map((question, index) => (

                                <Box
                                    key={question._id}
                                    sx={{
                                        p: 2,
                                        mb: 2,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 1,
                                    }}
                                >

                                    <Typography
                                        variant="h6"
                                        fontWeight={600}
                                    >
                                        {index + 1}.{" "}
                                        {question.title}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Code: {question.code}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 0.5 }}
                                    >
                                        Type:{" "}
                                        {question.questionType}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 0.5 }}
                                    >
                                        Difficulty:{" "}
                                        {question.difficulty}
                                    </Typography>

                                </Box>

                            ))}

                        </Box>

                    )}

            </Box>

        </DashboardLayout>

    );
};

export default TopicQuestionList;