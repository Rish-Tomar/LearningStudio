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

import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import LearningContentForm
    from "../../../components/learningStudio/LearningContentForm";

import learningContentService
    from "../../../services/learningContentService";

import {
    calculateRemainingWeight,
} from "../../../utils/learningStudioWeight";

import api from "../../../api/axios";


const CreateLearningContent = () => {

    const { topicId } = useParams();

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        title: "",
        content: "",
        sequence: 1,
        completionWeight: 10,
    });


    const [loading, setLoading] = useState(false);

    const [studioLoading, setStudioLoading] =
        useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState(false);

    const [remainingWeight, setRemainingWeight] =
        useState(null);


    /*
     * Fetch current Learning Studio weight
     */

    useEffect(() => {

        const fetchLearningStudio = async () => {

            try {

                setStudioLoading(true);

                setError("");


                const response =
                    await api.get(
                        `/learning-studio/topics/${topicId}`
                    );


                const studio =
                    response.data.data;


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
                    "Failed to fetch Learning Studio weight:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Failed to load Learning Studio"
                );


            } finally {

                setStudioLoading(false);

            }

        };


        fetchLearningStudio();

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

            setLoading(true);

            setError("");


            const payload = {

                topic: topicId,

                title:
                    formData.title.trim(),

                content:
                    formData.content.trim(),

                sequence:
                    Number(formData.sequence),

                completionWeight:
                    Number(formData.completionWeight),

            };


            const response =
                await learningContentService
                    .createLearningContent(
                        payload
                    );


            console.log(
                "Learning content created successfully:",
                response
            );


            setSuccess(true);


            setTimeout(() => {

                navigate(
                    `/faculty/topics/${topicId}/learning-studio`
                );

            }, 800);


        } catch (error) {

            console.error(
                "Failed to create learning content:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to create learning content"
            );


        } finally {

            setLoading(false);

        }

    };


    const handleCancel = () => {

        navigate(
            `/faculty/topics/${topicId}/learning-studio`
        );

    };


    if (studioLoading) {

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
                        Create Learning Content
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Add learning material to this topic
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

                        <LearningContentForm
                            formData={formData}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            loading={loading}
                            remainingWeight={
                                remainingWeight
                            }
                        />

                    </CardContent>

                </Card>


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
                        Learning content created successfully
                    </Alert>

                </Snackbar>

            </Box>

        </DashboardLayout>

    );

};


export default CreateLearningContent;