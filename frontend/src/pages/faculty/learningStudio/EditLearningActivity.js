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
    calculateEditAvailableWeight,
} from "../../../utils/learningStudioWeight";


const EditLearningActivity = () => {

    const {
        topicId,
        activityId,
    } = useParams();

    const navigate = useNavigate();


    const [questions, setQuestions] = useState([]);


    const [formData, setFormData] = useState({
        question: "",
        sequence: 1,
        completionWeight: 10,
    });


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState(false);

    const [remainingWeight, setRemainingWeight] =
        useState(null);


    useEffect(() => {

        const fetchData = async () => {

            try {

                setLoading(true);

                setError("");


                /*
                 * Fetch questions, activities and
                 * Learning Studio data in parallel.
                 */

                const [
                    questionsResponse,
                    activitiesResponse,
                    studioResponse
                ] = await Promise.all([

                    questionService
                        .getQuestionsByTopic(
                            topicId
                        ),

                    learningActivityService
                        .getLearningActivitiesByTopic(
                            topicId
                        ),

                    api.get(
                        `/learning-studio/topics/${topicId}`
                    ),

                ]);


                const topicQuestions =
                    questionsResponse.data || [];


                const activities =
                    activitiesResponse.data || [];


                /*
                 * Find requested activity
                 */

                const activity =
                    activities.find(
                        (item) =>
                            String(item._id) ===
                            String(activityId)
                    );


                if (!activity) {

                    setError(
                        "Learning activity not found"
                    );

                    return;

                }


                /*
                 * Populate questions
                 */

                setQuestions(
                    topicQuestions
                );


                /*
                 * Populate form
                 */

                setFormData({

                    question:
                        activity.question?._id || "",

                    sequence:
                        activity.sequence,

                    completionWeight:
                        activity.completionWeight,

                });


                /*
                 * Get Learning Studio data
                 */

                const studio =
                    studioResponse.data.data;


                const content =
                    studio.content || [];


                const studioActivities =
                    studio.activities || [];


                /*
                 * Calculate edit-aware available
                 * completion weight.
                 *
                 * If this activity is ACTIVE,
                 * its existing weight is excluded
                 * from the current active total.
                 */

                const availableWeight =
                    calculateEditAvailableWeight({
                        content,
                        activities:
                            studioActivities,
                        currentWeight:
                            activity.completionWeight,
                        currentStatus:
                            activity.status,
                    });


                setRemainingWeight(
                    availableWeight
                );


            } catch (error) {

                console.error(
                    "Failed to load learning activity:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Failed to load learning activity"
                );


            } finally {

                setLoading(false);

            }

        };


        fetchData();

    }, [topicId, activityId]);


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
                .updateLearningActivity(
                    activityId,
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
                "Failed to update learning activity:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to update learning activity"
            );


            setSaving(false);

        }

    };


    const handleCancel = () => {

        navigate(
            `/faculty/topics/${topicId}/learning-studio`
        );

    };


    if (loading) {

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
                        Edit Learning Activity
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Update this learning activity
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

                {!error && (

                    <Card elevation={2}>

                        <CardContent sx={{ p: 3 }}>

                            <LearningActivityForm
                                formData={formData}
                                questions={questions}
                                onChange={handleChange}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                                loading={saving}
                                submitLabel="Update Activity"
                                remainingWeight={
                                    remainingWeight
                                }
                            />

                        </CardContent>

                    </Card>

                )}


                {/* Success */}

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
                        Learning activity updated successfully
                    </Alert>

                </Snackbar>

            </Box>

        </DashboardLayout>

    );

};


export default EditLearningActivity;