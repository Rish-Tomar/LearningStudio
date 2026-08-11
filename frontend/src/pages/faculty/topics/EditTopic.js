import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Typography,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import TopicForm from "../../../components/topics/TopicForm";

import topicService from "../../../services/topicService";

const EditTopic = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        const fetchTopic = async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await topicService.getTopicById(id);

                const topic = response.data;

                setFormData({
                    name: topic.name || "",
                    code: topic.code || "",
                    description: topic.description || "",
                });

            } catch (error) {

                console.error(
                    "Failed to fetch topic:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load topic"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchTopic();

    }, [id]);

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

            const response = await topicService.updateTopic(
                id,
                formData
            );

            console.log(
                "Topic updated successfully:",
                response
            );

            navigate("/faculty/topics");

        } catch (error) {

            console.error(
                "Failed to update topic:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update topic"
            );

        } finally {

            setLoading(false);

        }

    };

    const handleCancel = () => {

        navigate("/faculty/topics");

    };

    if (loading) {

        return (
            <DashboardLayout>

                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="300px"
                >
                    <CircularProgress />
                </Box>

            </DashboardLayout>
        );

    }

    if (error) {

        return (
            <DashboardLayout>

                <Alert severity="error">
                    {error}
                </Alert>

            </DashboardLayout>
        );

    }

    return (

        <DashboardLayout>

            <Box>

                <Box sx={{ mb: 3 }}>

                    <Typography
                        variant="h4"
                        fontWeight={600}
                    >
                        Edit Topic
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Update topic information
                    </Typography>

                </Box>

                <Card elevation={2}>

                    <CardContent sx={{ p: 3 }}>

                        <TopicForm
                            formData={formData}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            submitLabel="Update Topic"
                        />

                    </CardContent>

                </Card>

            </Box>

        </DashboardLayout>

    );
};

export default EditTopic;