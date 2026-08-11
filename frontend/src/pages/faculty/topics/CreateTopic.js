import { useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Snackbar,
    Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import TopicForm from "../../../components/topics/TopicForm";

import topicService from "../../../services/topicService";

const CreateTopic = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
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
            [name]: value,
        }));

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setLoading(true);

            setError("");

            const response = await topicService.createTopic(
                formData
            );

            console.log(
                "Topic created successfully:",
                response
            );

            setSuccess(true);

            setTimeout(() => {

                navigate("/faculty/topics");

            }, 1000);

        } catch (error) {

            console.error(
                "Failed to create topic:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create topic"
            );

        } finally {

            setLoading(false);

        }

    };

    const handleCancel = () => {

        navigate("/faculty/topics");

    };

    return (

        <DashboardLayout>

            <Box>

                <Box sx={{ mb: 3 }}>

                    <Typography
                        variant="h4"
                        fontWeight={600}
                    >
                        Create Topic
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Add a new topic to your question bank
                    </Typography>

                </Box>

                <Card elevation={2}>

                    <CardContent sx={{ p: 3 }}>

                        <TopicForm
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
                        Topic created successfully
                    </Alert>
                </Snackbar>

                {error && (

                    <Alert
                        severity="error"
                        sx={{ mt: 2 }}
                    >
                        {error}
                    </Alert>

                )}

            </Box>

        </DashboardLayout>

    );
};

export default CreateTopic;