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

import LearningContentForm
    from "../../../components/learningStudio/LearningContentForm";

import learningContentService
    from "../../../services/learningContentService";

import api from "../../../api/axios";

import {
    calculateEditAvailableWeight,
} from "../../../utils/learningStudioWeight";


const EditLearningContent = () => {

    const {
        topicId,
        contentId,
    } = useParams();

    const navigate = useNavigate();


    const [learningContent, setLearningContent] =
        useState(null);


    const [formData, setFormData] = useState({
        title: "",
        content: "",
        sequence: "",
        completionWeight: "",
    });


    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState(false);

    const [remainingWeight, setRemainingWeight] =
        useState(null);


    useEffect(() => {

        const loadContent = async () => {

            try {

                setLoading(true);

                setError("");


                /*
                 * Fetch content and Learning Studio
                 * data in parallel.
                 */

                const [
                    contentResponse,
                    studioResponse
                ] = await Promise.all([

                    learningContentService
                        .getLearningContentByTopic(
                            topicId
                        ),

                    api.get(
                        `/learning-studio/topics/${topicId}`
                    ),

                ]);


                const contentList =
                    contentResponse.data || [];


                const contentItem =
                    contentList.find(
                        (item) =>
                            String(item._id) ===
                            String(contentId)
                    );


                if (!contentItem) {

                    setLearningContent(null);

                    setError(
                        "Learning content not found."
                    );

                    return;

                }


                setLearningContent(
                    contentItem
                );


                setFormData({

                    title:
                        contentItem.title || "",

                    content:
                        contentItem.content || "",

                    sequence:
                        contentItem.sequence || "",

                    completionWeight:
                        contentItem.completionWeight || "",

                });


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
                 * Calculate edit-aware available
                 * completion weight.
                 *
                 * If this content is ACTIVE,
                 * its existing weight is excluded
                 * from the current active total.
                 */

                const availableWeight =
                    calculateEditAvailableWeight({
                        content,
                        activities,
                        currentWeight:
                            contentItem.completionWeight,
                        currentStatus:
                            contentItem.status,
                    });


                setRemainingWeight(
                    availableWeight
                );


            } catch (error) {

                console.error(
                    "Failed to load learning content:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Failed to load learning content"
                );


            } finally {

                setLoading(false);

            }

        };


        loadContent();

    }, [topicId, contentId]);


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


            await learningContentService
                .updateLearningContent(
                    contentId,
                    {
                        title:
                            formData.title.trim(),

                        content:
                            formData.content.trim(),

                        sequence:
                            Number(
                                formData.sequence
                            ),

                        completionWeight:
                            Number(
                                formData.completionWeight
                            ),
                    }
                );


            setSuccess(true);


            setTimeout(() => {

                navigate(
                    `/faculty/topics/${topicId}/learning-studio`
                );

            }, 800);


        } catch (error) {

            console.error(
                "Failed to update learning content:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to update learning content"
            );


            setLoading(false);

        }

    };


    const handleCancel = () => {

        navigate(
            `/faculty/topics/${topicId}/learning-studio`
        );

    };


    if (loading && !learningContent) {

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
                        Edit Learning Content
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Update learning material for this topic
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

                {learningContent && (

                    <Card elevation={2}>

                        <CardContent sx={{ p: 3 }}>

                            <LearningContentForm
                                formData={formData}
                                onChange={handleChange}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                                loading={loading}
                                submitLabel="Update Content"
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
                        Learning content updated successfully
                    </Alert>

                </Snackbar>

            </Box>

        </DashboardLayout>

    );

};


export default EditLearningContent;