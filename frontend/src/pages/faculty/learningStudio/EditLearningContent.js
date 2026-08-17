import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Card,
    CardContent,
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


const EditLearningContent = () => {

    const {
        topicId,
        contentId,
    } = useParams();

    const navigate = useNavigate();


    const [learningContent, setLearningContent] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        sequence: "",
        completionWeight: "",
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState(false);


    useEffect(() => {

        const loadContent = async () => {

            try {

                setError("");

                const response =
                    await learningContentService.getLearningContentByTopic(
                        topicId
                    );

                const contentList =
                    response.data || [];

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


                setLearningContent(contentItem);


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


            await learningContentService.updateLearningContent(
                contentId,
                {
                    title:
                        formData.title.trim(),

                    content:
                        formData.content.trim(),

                    sequence:
                        Number(formData.sequence),

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


    return (

        <DashboardLayout>

            <Box>

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


                {error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>

                )}


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
                            />

                        </CardContent>

                    </Card>

                )}


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