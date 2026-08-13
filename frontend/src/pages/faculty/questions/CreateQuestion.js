import { useEffect, useState } from "react";

import {
    Alert,
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

import questionService
    from "../../../services/questionService";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";


const CreateQuestion = () => {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const topicFromUrl = searchParams.get("topic");


    const [formData, setFormData] = useState({

        // Common fields
        code: "",
        title: "",
        description: "",
        topic: topicFromUrl || "",
        questionType: "",
        difficulty: "",

        // MCQ fields
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

        // Coding fields
        constraints: [],
        inputFormat: "",
        outputFormat: "",
        allowedLanguages: [],
        executionTimeLimit: "",
        memoryLimit: "",

    });


    const [topics, setTopics] = useState([]);

    const [loadingTopics, setLoadingTopics] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [validationErrors, setValidationErrors] =
        useState({});


    /*
     * Topic Context
     *
     * If a topic is provided through the URL,
     * the question is being created from
     * Topic → Manage Questions.
     */

    const topicLocked = Boolean(topicFromUrl);


    /*
     * Fetch Topics
     */

    useEffect(() => {

        const fetchTopics = async () => {

            try {

                setLoadingTopics(true);

                setError("");

                const response =
                    await topicService.getTopics();

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


    /*
     * Handle Common Field Changes
     */

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        /*
         * Topic is locked when the page
         * was opened from Topic context.
         */

        if (
            name === "topic" &&
            topicLocked
        ) {

            return;

        }


        setFormData((previousData) => ({

            ...previousData,

            [name]: value,

        }));


        /*
         * Remove field-level validation
         * error when user changes the field.
         */

        setValidationErrors(
            (previousErrors) => {

                if (!previousErrors[name]) {

                    return previousErrors;

                }

                const updatedErrors = {
                    ...previousErrors,
                };

                delete updatedErrors[name];

                return updatedErrors;

            }
        );

    };


    /*
     * Build Backend Payload
     */

    const buildQuestionPayload = () => {

        const payload = {

            code:
                formData.code.trim(),

            title:
                formData.title.trim(),

            description:
                formData.description.trim(),

            topic:
                formData.topic,

            questionType:
                formData.questionType,

            difficulty:
                formData.difficulty,

        };


        /*
         * MCQ
         */

        if (
            formData.questionType === "MCQ"
        ) {

            payload.options =
                formData.options.map(
                    (option) => ({

                        key: option.key,

                        text:
                            option.text.trim(),

                    })
                );

            payload.correctAnswer =
                formData.correctAnswer;

            payload.explanation =
                formData.explanation.trim();

        }


        /*
         * CODING
         */

        if (
            formData.questionType === "CODING"
        ) {

            payload.constraints =
                formData.constraints;

            payload.inputFormat =
                formData.inputFormat.trim();

            payload.outputFormat =
                formData.outputFormat.trim();

            payload.allowedLanguages =
                formData.allowedLanguages;

            payload.executionTimeLimit =
                Number(
                    formData.executionTimeLimit
                );

            payload.memoryLimit =
                Number(
                    formData.memoryLimit
                );

        }


        return payload;

    };


    /*
     * Validate Question
     */

    const validateQuestion = () => {

        const errors = {};


        /*
         * Common
         */

        if (!formData.code.trim()) {

            errors.code =
                "Question code is required";

        }

        if (!formData.title.trim()) {

            errors.title =
                "Question title is required";

        }

        if (!formData.description.trim()) {

            errors.description =
                "Question description is required";

        }

        if (!formData.topic) {

            errors.topic =
                "Topic is required";

        }

        if (!formData.questionType) {

            errors.questionType =
                "Question type is required";

        }

        if (!formData.difficulty) {

            errors.difficulty =
                "Difficulty is required";

        }


        /*
         * MCQ
         */

        if (
            formData.questionType === "MCQ"
        ) {

            if (
                !formData.options ||
                formData.options.length < 2
            ) {

                errors.options =
                    "MCQ must have at least 2 options";

            }


            const hasEmptyOption =
                formData.options?.some(
                    (option) =>
                        !option.text.trim()
                );


            if (hasEmptyOption) {

                errors.options =
                    "All MCQ options must contain text";

            }


            if (!formData.correctAnswer) {

                errors.correctAnswer =
                    "Correct answer is required";

            }


            const correctAnswerExists =
                formData.options?.some(
                    (option) =>
                        option.key ===
                        formData.correctAnswer
                );


            if (
                formData.correctAnswer &&
                !correctAnswerExists
            ) {

                errors.correctAnswer =
                    "Correct answer must match an option";

            }

        }


        /*
         * CODING
         */

        if (
            formData.questionType === "CODING"
        ) {

            if (
                !formData.inputFormat.trim()
            ) {

                errors.inputFormat =
                    "Input format is required";

            }


            if (
                !formData.outputFormat.trim()
            ) {

                errors.outputFormat =
                    "Output format is required";

            }


            if (
                !formData.allowedLanguages ||
                formData.allowedLanguages.length === 0
            ) {

                errors.allowedLanguages =
                    "Select at least one allowed language";

            }


            const executionTime =
                Number(
                    formData.executionTimeLimit
                );


            if (
                !formData.executionTimeLimit ||
                Number.isNaN(executionTime) ||
                executionTime < 100
            ) {

                errors.executionTimeLimit =
                    "Execution time must be at least 100 ms";

            }


            const memoryLimit =
                Number(
                    formData.memoryLimit
                );


            if (
                !formData.memoryLimit ||
                Number.isNaN(memoryLimit) ||
                memoryLimit < 16
            ) {

                errors.memoryLimit =
                    "Memory limit must be at least 16 MB";

            }

        }


        return errors;

    };


    /*
     * Submit Question
     */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess("");

        setValidationErrors({});


        /*
         * Frontend validation
         */

        const errors =
            validateQuestion();


        if (
            Object.keys(errors).length > 0
        ) {

            setValidationErrors(errors);

            return;

        }


        /*
         * Build payload
         */

        const payload =
            buildQuestionPayload();


        try {

            setSubmitting(true);


            /*
             * POST /api/questions
             */

            const response =
                await questionService.createQuestion(
                    payload
                );


            console.log(
                "Question created successfully:",
                response
            );


            setSuccess(
                "Question created successfully."
            );


            /*
             * Return to the topic's
             * question list when created
             * from Topic context.
             */

            setTimeout(() => {

                if (topicLocked) {

                    navigate(
                        `/faculty/topics/${topicFromUrl}/questions`
                    );

                } else {

                    navigate(
                        "/faculty/questions"
                    );

                }

            }, 800);


        } catch (error) {

            console.error(
                "Failed to create question:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to create question"
            );

        } finally {

            setSubmitting(false);

        }

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


                {/* Success */}

                {success && (

                    <Alert
                        severity="success"
                        sx={{ mb: 2 }}
                    >
                        {success}
                    </Alert>

                )}


                {/* Backend Error */}

                {error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>

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
                                onSubmit={handleSubmit}
                                validationErrors={
                                    validationErrors
                                }
                                topicLocked={topicLocked}
                                submitting={submitting}
                            />

                        </CardContent>

                    </Card>

                )}

            </Box>

        </DashboardLayout>

    );

};


export default CreateQuestion;