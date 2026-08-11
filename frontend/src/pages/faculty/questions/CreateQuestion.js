import { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Typography,
} from "@mui/material";

import DashboardLayout from "../../../layouts/DashboardLayout";

import QuestionForm
    from "../../../components/questions/QuestionForm";

import topicService
    from "../../../services/topicService";


const CreateQuestion = () => {

    const [formData, setFormData] = useState({

        code: "",
        title: "",
        description: "",
        topic: "",
        questionType: "",
        difficulty: "",

        options: [
            {
                key: "A",
                text: "",
            },
            {
                key: "B",
                text: "",
            },
        ],

        correctAnswer: "",

        explanation: "",
        // Coding
        constraints: [],
        inputFormat: "",
        outputFormat: "",
        allowedLanguages: [],
        executionTimeLimit: "",
        memoryLimit: "",

    });


    const [topics, setTopics] = useState([]);

    const [loadingTopics, setLoadingTopics] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchTopics = async () => {

            try {

                setLoadingTopics(true);

                setError("");

                const response =
                    await topicService.getTopics();

                console.log(
                    "Topics fetched for question form:",
                    response
                );

                setTopics(response.data);

            } catch (error) {

                console.error(
                    "Failed to fetch topics:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load topics"
                );

            } finally {

                setLoadingTopics(false);

            }

        };

        fetchTopics();

    }, []);


    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData((previousData) => ({

            ...previousData,

            [name]: value,

        }));

    };


    return (

        <DashboardLayout>

            <Box>

                {/* Page Header */}

                <Box sx={{ mb: 3 }}>

                    <Typography
                        variant="h4"
                        fontWeight={600}
                    >
                        Create Question
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Create a new MCQ or Coding question
                    </Typography>

                </Box>


                {/* Error */}

                {error && (

                    <Typography
                        color="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Typography>

                )}


                {/* Loading Topics */}

                {loadingTopics ? (

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 5,
                        }}
                    >
                        <CircularProgress />
                    </Box>

                ) : (

                    <Card elevation={2}>

                        <CardContent sx={{ p: 3 }}>

                            <QuestionForm
                                formData={formData}
                                topics={topics}
                                onChange={handleChange}
                                setFormData={setFormData}
                            />

                        </CardContent>

                    </Card>

                )}

            </Box>

        </DashboardLayout>

    );

};


export default CreateQuestion;