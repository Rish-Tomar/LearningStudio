import { useEffect, useMemo, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    CircularProgress,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import QuizIcon from "@mui/icons-material/Quiz";
import SaveIcon from "@mui/icons-material/Save";
import PublishIcon from "@mui/icons-material/Publish";
import AddIcon from "@mui/icons-material/Add";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

import DashboardLayout from "../../../layouts/DashboardLayout";

import questionService from "../../../services/questionService";
import assessmentService from "../../../services/assessmentService";


const generateAssessmentCode = () => {
    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "QUIZ-";

    for (let i = 0; i < 6; i++) {
        code += characters[
            Math.floor(
                Math.random() * characters.length
            )
        ];
    }

    return code;
};


const getDateTimeLocalValue = (date) => {
    const offset = date.getTimezoneOffset();

    const localDate = new Date(
        date.getTime() -
        offset * 60 * 1000
    );

    return localDate
        .toISOString()
        .slice(0, 16);
};


const calculateEndTime = (startAt, duration) => {
    if (
        !startAt ||
        !duration ||
        Number(duration) <= 0
    ) {
        return "";
    }

    const start = new Date(startAt);

    if (Number.isNaN(start.getTime())) {
        return "";
    }

    start.setMinutes(
        start.getMinutes() + Number(duration)
    );

    return getDateTimeLocalValue(start);
};


const CreateAssessment = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();

    const initialStartAt =
        getDateTimeLocalValue(new Date());

    const [formData, setFormData] = useState({
        title: "",
        code: generateAssessmentCode(),
        description: "",
        duration: 20,
        startAt: initialStartAt,
        endAt: calculateEndTime(
            initialStartAt,
            20
        )
    });

    const [questions, setQuestions] =
        useState([]);

    const [selectedQuestions, setSelectedQuestions] =
        useState([]);

    const [loadingQuestions, setLoadingQuestions] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [questionType, setQuestionType] =
        useState("MCQ");

    const [difficulty, setDifficulty] =
        useState("ALL");


    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoadingQuestions(true);

                const response =
                    await questionService.getQuestions();

                const fetchedQuestions =
                    response.data || [];

                setQuestions(
                    fetchedQuestions.filter(
                        (question) =>
                            question.status === "ACTIVE"
                    )
                );
            } catch (error) {
                console.error(
                    "Failed to fetch questions:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load questions"
                );
            } finally {
                setLoadingQuestions(false);
            }
        };

        fetchQuestions();
    }, []);


    const filteredQuestions = useMemo(() => {
        return questions.filter((question) => {
            const search =
                searchTerm
                    .trim()
                    .toLowerCase();

            const matchesSearch =
                !search ||
                question.title
                    ?.toLowerCase()
                    .includes(search) ||
                question.code
                    ?.toLowerCase()
                    .includes(search);

            const matchesType =
                questionType === "ALL" ||
                question.questionType ===
                    questionType;

            const matchesDifficulty =
                difficulty === "ALL" ||
                question.difficulty ===
                    difficulty;

            return (
                matchesSearch &&
                matchesType &&
                matchesDifficulty
            );
        });
    }, [
        questions,
        searchTerm,
        questionType,
        difficulty
    ]);


    const handleFormChange = (event) => {
        const {
            name,
            value
        } = event.target;

        setFormData((previousData) => {
            const updatedData = {
                ...previousData,
                [name]: value
            };

            if (
                name === "startAt" ||
                name === "duration"
            ) {
                updatedData.endAt =
                    calculateEndTime(
                        name === "startAt"
                            ? value
                            : previousData.startAt,
                        name === "duration"
                            ? value
                            : previousData.duration
                    );
            }

            return updatedData;
        });
    };


    const isQuestionSelected = (questionId) => {
        return selectedQuestions.some(
            (item) =>
                item.question._id ===
                questionId
        );
    };


    const addQuestion = (question) => {
        if (
            isQuestionSelected(
                question._id
            )
        ) {
            return;
        }

        setSelectedQuestions(
            (previousQuestions) => [
                ...previousQuestions,
                {
                    question,
                    marks: 1
                }
            ]
        );
    };


    const removeQuestion = (questionId) => {
        setSelectedQuestions(
            (previousQuestions) =>
                previousQuestions.filter(
                    (item) =>
                        item.question._id !==
                        questionId
                )
        );
    };


    const updateMarks = (
        questionId,
        marks
    ) => {
        setSelectedQuestions(
            (previousQuestions) =>
                previousQuestions.map(
                    (item) => {
                        if (
                            item.question._id !==
                            questionId
                        ) {
                            return item;
                        }

                        return {
                            ...item,
                            marks
                        };
                    }
                )
        );
    };


    const moveQuestion = (
        index,
        direction
    ) => {
        const newIndex =
            index + direction;

        if (
            newIndex < 0 ||
            newIndex >=
                selectedQuestions.length
        ) {
            return;
        }

        setSelectedQuestions(
            (previousQuestions) => {
                const updated = [
                    ...previousQuestions
                ];

                const current =
                    updated[index];

                updated[index] =
                    updated[newIndex];

                updated[newIndex] =
                    current;

                return updated;
            }
        );
    };


    const validateForm = () => {
        if (!formData.title.trim()) {
            setError(
                "Quiz title is required"
            );

            return false;
        }

        if (!formData.code.trim()) {
            setError(
                "Quiz code is required"
            );

            return false;
        }

        if (
            !Number.isInteger(
                Number(formData.duration)
            ) ||
            Number(formData.duration) <= 0
        ) {
            setError(
                "Duration must be a positive number of minutes"
            );

            return false;
        }

        if (
            selectedQuestions.length === 0
        ) {
            setError(
                "Add at least one question to the quiz"
            );

            return false;
        }

        const startDate =
            new Date(formData.startAt);

        const endDate =
            new Date(formData.endAt);

        if (
            Number.isNaN(
                startDate.getTime()
            ) ||
            Number.isNaN(
                endDate.getTime()
            )
        ) {
            setError(
                "Please provide valid availability dates"
            );

            return false;
        }

        if (endDate <= startDate) {
            setError(
                "Available Until must be after Available From"
            );

            return false;
        }

        return true;
    };


    const createQuiz = async (
        shouldPublish = false
    ) => {
        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        if (!auth?.user?._id) {
            setError(
                "Unable to identify the logged-in user. Please log in again."
            );

            return;
        }

        try {
            setSubmitting(true);

            /*
             * Step 1:
             * Create the assessment.
             */

            const assessmentResponse =
                await assessmentService.createAssessment({
                    code:
                        formData.code
                            .trim()
                            .toUpperCase(),

                    title:
                        formData.title.trim(),

                    description:
                        formData.description.trim(),

                    duration:
                        Number(formData.duration),

                    startAt:
                        new Date(
                            formData.startAt
                        ).toISOString(),

                    endAt:
                        new Date(
                            formData.endAt
                        ).toISOString(),

                    createdBy:
                        auth?.user?._id
                });


            const assessment =
                assessmentResponse.data;


            /*
             * Step 2:
             * Create one MCQ section.
             */

            const sectionResponse =
                await assessmentService
                    .createAssessmentSection({
                        assessment:
                            assessment._id,

                        name:
                            "Quiz Questions",

                        description:
                            "Questions for this quiz",

                        questionType:
                            "MCQ",

                        order: 1
                    });


            const section =
                sectionResponse.data;


            /*
             * Step 3:
             * Add selected questions.
             */

            for (
                let index = 0;
                index <
                selectedQuestions.length;
                index++
            ) {
                const selected =
                    selectedQuestions[index];

                await assessmentService
                    .createAssessmentQuestion({
                        assessment:
                            assessment._id,

                        section:
                            section._id,

                        question:
                            selected.question._id,

                        order:
                            index + 1,

                        marks:
                            Number(
                                selected.marks
                            )
                    });
            }


            /*
             * Step 4:
             * Publish if requested.
             */

            if (shouldPublish) {
                await assessmentService
                    .publishAssessment(
                        assessment._id
                    );

                setSuccess(
                    "Quiz published successfully"
                );
            } else {
                setSuccess(
                    "Quiz saved as draft successfully"
                );
            }


            setTimeout(() => {
                navigate(
                    "/faculty/assessments"
                );
            }, 900);

        } catch (error) {
            console.error(
                "Failed to create quiz:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create quiz"
            );
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <DashboardLayout>
            <Box
                sx={{
                    maxWidth: 1400,
                    mx: "auto"
                }}
            >

                {/* Header */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: {
                            xs: "flex-start",
                            md: "center"
                        },
                        gap: 2,
                        mb: 3
                    }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={600}
                        >
                            Create Quiz
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Build a classroom quiz
                            from your Question Bank
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        onClick={() =>
                            navigate(
                                "/faculty/assessments"
                            )
                        }
                    >
                        Cancel
                    </Button>
                </Box>


                {/* Messages */}

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

                {success && (
                    <Alert
                        severity="success"
                        sx={{ mb: 2 }}
                    >
                        {success}
                    </Alert>
                )}


                {/* Quiz Details */}

                <Card sx={{ mb: 3 }}>
                    <CardContent>

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 3 }}
                        >
                            <QuizIcon color="primary" />

                            <Typography
                                variant="h6"
                                fontWeight={600}
                            >
                                Quiz Details
                            </Typography>
                        </Stack>


                        <Grid
                            container
                            spacing={2}
                        >

                            {/* Quiz Title */}

                            <Grid
                                item
                                xs={12}
                                md={8}
                            >
                                <TextField
                                    fullWidth
                                    required
                                    label="Quiz Title"
                                    name="title"
                                    value={
                                        formData.title
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="e.g. Java Tokens Quiz"
                                />
                            </Grid>


                            {/* Quiz Code */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >
                                <TextField
                                    fullWidth
                                    required
                                    label="Quiz Code"
                                    name="code"
                                    value={
                                        formData.code
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    helperText="Unique code for this assessment"
                                />
                            </Grid>


                            {/* Description */}

                            <Grid
                                item
                                xs={12}
                            >
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="Describe what students will be assessed on..."
                                />
                            </Grid>


                            {/* Duration */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Duration (minutes)"
                                    name="duration"
                                    value={
                                        formData.duration
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    inputProps={{
                                        min: 1
                                    }}
                                />
                            </Grid>


                            {/* Available From */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >
                                <TextField
                                    fullWidth
                                    required
                                    type="datetime-local"
                                    label="Available From"
                                    name="startAt"
                                    value={
                                        formData.startAt
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>


                            {/* Available Until */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >
                                <TextField
                                    fullWidth
                                    type="datetime-local"
                                    label="Available Until"
                                    name="endAt"
                                    value={
                                        formData.endAt
                                    }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    helperText="Auto Calculated"
                                />
                            </Grid>

                        </Grid>

                    </CardContent>
                </Card>


                {/* Question Selection */}

                <Grid
                    container
                    spacing={3}
                >

                    {/* Question Bank */}

                    <Grid
                        item
                        xs={12}
                        md={7}
                    >
                        <Card>
                            <CardContent>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 2
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            fontWeight={600}
                                        >
                                            Question Bank
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Select active MCQ questions
                                        </Typography>
                                    </Box>

                                    <Chip
                                        label={`${filteredQuestions.length} available`}
                                        size="small"
                                    />
                                </Box>


                                {/* Filters */}

                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row"
                                    }}
                                    spacing={2}
                                    sx={{ mb: 2 }}
                                >

                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Search questions"
                                        value={
                                            searchTerm
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSearchTerm(
                                                event.target.value
                                            )
                                        }
                                    />


                                    <FormControl
                                        size="small"
                                        sx={{
                                            minWidth: 130
                                        }}
                                    >
                                        <InputLabel>
                                            Type
                                        </InputLabel>

                                        <Select
                                            value={
                                                questionType
                                            }
                                            label="Type"
                                            onChange={(
                                                event
                                            ) =>
                                                setQuestionType(
                                                    event.target.value
                                                )
                                            }
                                        >
                                            <MenuItem value="ALL">
                                                All
                                            </MenuItem>

                                            <MenuItem value="MCQ">
                                                MCQ
                                            </MenuItem>

                                            <MenuItem value="CODING">
                                                Coding
                                            </MenuItem>
                                        </Select>
                                    </FormControl>


                                    <FormControl
                                        size="small"
                                        sx={{
                                            minWidth: 140
                                        }}
                                    >
                                        <InputLabel>
                                            Difficulty
                                        </InputLabel>

                                        <Select
                                            value={
                                                difficulty
                                            }
                                            label="Difficulty"
                                            onChange={(
                                                event
                                            ) =>
                                                setDifficulty(
                                                    event.target.value
                                                )
                                            }
                                        >
                                            <MenuItem value="ALL">
                                                All
                                            </MenuItem>

                                            <MenuItem value="EASY">
                                                Easy
                                            </MenuItem>

                                            <MenuItem value="MEDIUM">
                                                Medium
                                            </MenuItem>

                                            <MenuItem value="HARD">
                                                Hard
                                            </MenuItem>
                                        </Select>
                                    </FormControl>

                                </Stack>


                                <Divider
                                    sx={{ mb: 1 }}
                                />


                                {/* Question List */}

                                {loadingQuestions && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            py: 6
                                        }}
                                    >
                                        <CircularProgress />
                                    </Box>
                                )}


                                {!loadingQuestions &&
                                    filteredQuestions.length ===
                                        0 && (
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
                                                No questions match
                                                your filters.
                                            </Typography>
                                        </Paper>
                                    )}


                                {!loadingQuestions &&
                                    filteredQuestions.map(
                                        (question) => {
                                            const selected =
                                                isQuestionSelected(
                                                    question._id
                                                );

                                            return (
                                                <Paper
                                                    key={
                                                        question._id
                                                    }
                                                    variant="outlined"
                                                    sx={{
                                                        p: 1.5,
                                                        mb: 1,
                                                        bgcolor:
                                                            selected
                                                                ? "action.selected"
                                                                : "background.paper"
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "flex-start",
                                                            gap: 1
                                                        }}
                                                    >

                                                        <Checkbox
                                                            checked={
                                                                selected
                                                            }
                                                            onChange={() =>
                                                                selected
                                                                    ? removeQuestion(
                                                                          question._id
                                                                      )
                                                                    : addQuestion(
                                                                          question
                                                                      )
                                                            }
                                                        />


                                                        <Box
                                                            sx={{
                                                                flexGrow: 1,
                                                                minWidth: 0
                                                            }}
                                                        >
                                                            <Typography
                                                                fontWeight={600}
                                                            >
                                                                {
                                                                    question.title
                                                                }
                                                            </Typography>

                                                            <Stack
                                                                direction="row"
                                                                spacing={1}
                                                                sx={{
                                                                    mt: 0.75
                                                                }}
                                                            >
                                                                <Chip
                                                                    label={
                                                                        question.questionType
                                                                    }
                                                                    size="small"
                                                                />

                                                                <Chip
                                                                    label={
                                                                        question.difficulty
                                                                    }
                                                                    size="small"
                                                                    variant="outlined"
                                                                />

                                                                {question.code && (
                                                                    <Chip
                                                                        label={
                                                                            question.code
                                                                        }
                                                                        size="small"
                                                                        variant="outlined"
                                                                    />
                                                                )}
                                                            </Stack>
                                                        </Box>


                                                        {!selected && (
                                                            <Tooltip
                                                                title="Add question"
                                                            >
                                                                <IconButton
                                                                    color="primary"
                                                                    onClick={() =>
                                                                        addQuestion(
                                                                            question
                                                                        )
                                                                    }
                                                                >
                                                                    <AddIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}

                                                    </Box>
                                                </Paper>
                                            );
                                        }
                                    )}

                            </CardContent>
                        </Card>
                    </Grid>


                    {/* Selected Questions */}

                    <Grid
                        item
                        xs={12}
                        md={5}
                    >
                        <Card>
                            <CardContent>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 2
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            fontWeight={600}
                                        >
                                            Selected Questions
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Arrange questions and set marks
                                        </Typography>
                                    </Box>

                                    <Chip
                                        label={`${selectedQuestions.length} selected`}
                                        color={
                                            selectedQuestions.length
                                                ? "primary"
                                                : "default"
                                        }
                                    />
                                </Box>


                                {selectedQuestions.length ===
                                    0 && (
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
                                            Select questions from
                                            the Question Bank.
                                        </Typography>
                                    </Paper>
                                )}


                                <Stack spacing={1.5}>

                                    {selectedQuestions.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <Paper
                                                key={
                                                    item.question._id
                                                }
                                                variant="outlined"
                                                sx={{
                                                    p: 1.5
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        gap: 1.5,
                                                        alignItems: "flex-start"
                                                    }}
                                                >

                                                    <Typography
                                                        sx={{
                                                            fontWeight: 700,
                                                            minWidth: 28
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </Typography>


                                                    <Box
                                                        sx={{
                                                            flexGrow: 1,
                                                            minWidth: 0
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={600}
                                                        >
                                                            {
                                                                item
                                                                    .question
                                                                    .title
                                                            }
                                                        </Typography>


                                                        <TextField
                                                            size="small"
                                                            type="number"
                                                            label="Marks"
                                                            value={
                                                                item.marks
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                updateMarks(
                                                                    item
                                                                        .question
                                                                        ._id,
                                                                    event.target.value
                                                                )
                                                            }
                                                            inputProps={{
                                                                min: 1,
                                                                step: 1
                                                            }}
                                                            sx={{
                                                                mt: 1,
                                                                width: 100
                                                            }}
                                                        />
                                                    </Box>


                                                    <Stack
                                                        direction="row"
                                                    >

                                                        <Tooltip
                                                            title="Move up"
                                                        >
                                                            <span>
                                                                <IconButton
                                                                    size="small"
                                                                    disabled={
                                                                        index ===
                                                                        0
                                                                    }
                                                                    onClick={() =>
                                                                        moveQuestion(
                                                                            index,
                                                                            -1
                                                                        )
                                                                    }
                                                                >
                                                                    <ArrowUpwardIcon
                                                                        fontSize="small"
                                                                    />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>


                                                        <Tooltip
                                                            title="Move down"
                                                        >
                                                            <span>
                                                                <IconButton
                                                                    size="small"
                                                                    disabled={
                                                                        index ===
                                                                        selectedQuestions.length -
                                                                            1
                                                                    }
                                                                    onClick={() =>
                                                                        moveQuestion(
                                                                            index,
                                                                            1
                                                                        )
                                                                    }
                                                                >
                                                                    <ArrowDownwardIcon
                                                                        fontSize="small"
                                                                    />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>


                                                        <Tooltip
                                                            title="Remove"
                                                        >
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() =>
                                                                    removeQuestion(
                                                                        item
                                                                            .question
                                                                            ._id
                                                                    )
                                                                }
                                                            >
                                                                <DeleteIcon
                                                                    fontSize="small"
                                                                />
                                                            </IconButton>
                                                        </Tooltip>

                                                    </Stack>

                                                </Box>
                                            </Paper>
                                        )
                                    )}

                                </Stack>


                                {selectedQuestions.length > 0 && (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            pt: 2,
                                            borderTop: 1,
                                            borderColor: "divider",
                                            display: "flex",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <Typography
                                            fontWeight={600}
                                        >
                                            Total Marks
                                        </Typography>

                                        <Typography
                                            fontWeight={700}
                                        >
                                            {
                                                selectedQuestions.reduce(
                                                    (
                                                        total,
                                                        item
                                                    ) =>
                                                        total +
                                                        Number(
                                                            item.marks
                                                        ),
                                                    0
                                                )
                                            }
                                        </Typography>
                                    </Box>
                                )}

                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>


                {/* Bottom Actions */}

                <Paper
                    sx={{
                        mt: 3,
                        p: 2,
                        position: "sticky",
                        bottom: 16,
                        zIndex: 5,
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: 4
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1.5,
                            flexWrap: "wrap"
                        }}
                    >

                        <Button
                            variant="outlined"
                            startIcon={
                                <SaveIcon />
                            }
                            disabled={
                                submitting
                            }
                            onClick={() =>
                                createQuiz(
                                    false
                                )
                            }
                        >
                            Save Draft
                        </Button>


                        <Button
                            variant="contained"
                            startIcon={
                                <PublishIcon />
                            }
                            disabled={
                                submitting
                            }
                            onClick={() =>
                                createQuiz(
                                    true
                                )
                            }
                        >
                            Publish Quiz
                        </Button>

                    </Box>
                </Paper>

            </Box>
        </DashboardLayout>
    );
};


export default CreateAssessment;