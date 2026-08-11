import { useEffect, useState } from "react";

import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Button
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add'

import DashboardLayout from "../../../layouts/DashboardLayout";

import questionService from "../../../services/questionService";

import QuestionTable from "../../../components/questions/QuestionTable";

import { useNavigate } from "react-router-dom";

const QuestionList = () => {
    
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [questionType, setQuestionType] = useState("ALL");

     
    useEffect(() => {

        const fetchQuestions = async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await questionService.getQuestions();

                console.log(
                    "Questions fetched:",
                    response
                );

                setQuestions(response.data);

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

                setLoading(false);

            }

        };

        fetchQuestions();

    }, []);


    const filteredQuestions = questions.filter(
        (question) => {

            const matchesSearch =
                question.title
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    );

            const matchesType =
                questionType === "ALL" ||
                question.questionType === questionType;

            return (
                matchesSearch &&
                matchesType
            );

        }
    );


    return (

        <DashboardLayout>

            <Box>

                {/* Page Header */}

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
                            Manage your MCQ and Coding questions
                        </Typography>

                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() =>
                            navigate("/faculty/questions/create")
                        }
                    >
                        Create Question
                    </Button>

                </Box>


                {/* Search and Filter */}

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        mb: 3,
                    }}
                >

                    <TextField
                        size="small"
                        label="Search questions"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                        sx={{
                            minWidth: 280,
                        }}
                    />


                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 150,
                        }}
                    >

                        <InputLabel>
                            Type
                        </InputLabel>

                        <Select
                            value={questionType}
                            label="Type"
                            onChange={(event) =>
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

                </Box>


                {/* Loading */}

                {loading && (

                    <Typography>
                        Loading questions...
                    </Typography>

                )}


                {/* Error */}

                {error && (

                    <Typography
                        color="error"
                    >
                        {error}
                    </Typography>

                )}


                {/* Question Table */}

                {!loading && !error && (

                    <QuestionTable
                        questions={filteredQuestions}
                    />

                )}

            </Box>

        </DashboardLayout>

    );

};


export default QuestionList;