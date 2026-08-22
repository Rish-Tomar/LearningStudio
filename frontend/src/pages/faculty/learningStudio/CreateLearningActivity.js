import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Snackbar,
    Typography,
} from "@mui/material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import LearningActivityForm
    from "../../../components/learningStudio/LearningActivityForm";

import learningActivityService
    from "../../../services/learningActivityService";

import questionService
    from "../../../services/questionService";

import api from "../../../api/axios";

import {
    calculateRemainingWeight,
} from "../../../utils/learningStudioWeight";


const CreateLearningActivity = () => {

    const { topicId } = useParams();

    const navigate = useNavigate();


    const [questions, setQuestions] = useState([]);


    const [formData, setFormData] = useState({
        question: "",
        sequence: 1,
        completionWeight: 10,
    });


    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [studioLoading, setStudioLoading] =
        useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState(false);

    const [remainingWeight, setRemainingWeight] =
        useState(null);


    /*
     * Fetch Questions and Learning Studio Weight
     */

    useEffect(() => {

        const fetchPageData = async () => {

            try {

                setLoading(true);

                setStudioLoading(true);

                setError("");


                /*
                 * Fetch questions and Learning Studio
                 * information in parallel.
                 */

                const [
                    questionsResponse,
                    studioResponse
                ] = await Promise.all([

                    questionService
                        .getQuestionsByTopic(
                            topicId
                        ),

                    api.get(
                        `/learning-studio/topics/${topicId}`
                    ),

                ]);


                /*
                 * Set Questions
                 */

                setQuestions(
                    questionsResponse.data || []
                );


                /*
                 * Get Learning Studio data
                 */

                const studio =
                    studioResponse.data.data;


                const content =
                    studio.content || [];


                const activities =
                    studio.activities || [];


                /*
                 * Calculate remaining completion weight
                 */

                const calculatedRemainingWeight =
                    calculateRemainingWeight(
                        content,
                        activities
                    );


                setRemainingWeight(
                    calculatedRemainingWeight
                );


            } catch (error) {

                console.error(
                    "Failed to load Create Learning Activity page:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Failed to load learning activity data"
                );


            } finally {

                setLoading(false);

                setStudioLoading(false);

            }

        };


        fetchPageData();

    }, [topicId]);


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


    const handleSubmit = async (event) => {

        event.preventDefault();


        try {

            setSaving(true);

            setError("");


            const payload = {

                topic: topicId,

                question:
                    formData.question,

                sequence:
                    Number(
                        formData.sequence
                    ),

                completionWeight:
                    Number(
                        formData.completionWeight
                    ),

            };


            await learningActivityService
                .createLearningActivity(
                    payload
                );


            setSuccess(true);


            setTimeout(() => {

                navigate(
                    `/faculty/topics/${topicId}/learning-studio`
                );

            }, 800);


        } catch (error) {

            console.error(
                "Failed to create learning activity:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to create learning activity"
            );


            setSaving(false);

        }

    };


    const handleCancel = () => {

        navigate(
            `/faculty/topics/${topicId}/learning-studio`
        );

    };


    /*
     * Show loading state while page data
     * is being loaded.
     */

    if (
        loading ||
        studioLoading
    ) {

        return (

            <DashboardLayout>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "300px",
                    }}
                >

                    <CircularProgress />

                </Box>

            </DashboardLayout>

        );

    }


    return (

        <DashboardLayout>

            <Box>

                {/* Page Header */}

                <Box sx={{ mb: 3 }}>

                    <Typography
                        variant="h4"
                        fontWeight={600}
                    >
                        Create Learning Activity
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Add a question as a learning activity
                        for this topic
                    </Typography>

                </Box>


                {/* Error */}

                {error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>

                )}


                {/* Form */}

                <Card elevation={2}>

                    <CardContent sx={{ p: 3 }}>

                        <LearningActivityForm
                            formData={formData}
                            questions={questions}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            loading={saving}
                            submitLabel="Create Activity"
                            remainingWeight={
                                remainingWeight
                            }
                        />

                    </CardContent>

                </Card>


                {/* Success Message */}

                <Snackbar
                    open={success}
                    autoHideDuration={2000}
                    onClose={() =>
                        setSuccess(false)
                    }
                >

                    <Alert
                        severity="success"
                        variant="filled"
                    >
                        Learning activity created successfully
                    </Alert>

                </Snackbar>

            </Box>

        </DashboardLayout>

    );

};


export default CreateLearningActivity;