import { useState } from "react";

import {
    Alert,
    Box,
    Card,
    CardContent,
    Snackbar,
    Typography,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import LearningContentForm
    from "../../../components/learningStudio/LearningContentForm";

import learningContentService
    from "../../../services/learningContentService";


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

    const [error, setError] = useState("");

    const [success, setSuccess] = useState(false);


    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setFormData((previousData) => ({

            ...previousData,

            [name]:
                name === "sequence" ||
                name === "completionWeight"
                    ? value
                    : value,

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
                await learningContentService.createLearningContent(
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


    return (

        <DashboardLayout>

            <Box>

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


                {error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>

                )}


                <Card elevation={2}>

                    <CardContent sx={{ p: 3 }}>

                        <LearningContentForm
                            formData={formData}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            loading={loading}
                        />

                    </CardContent>

                </Card>


                <Snackbar
                    open={success}
                    autoHideDuration={2000}
                    onClose={() => setSuccess(false)}
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