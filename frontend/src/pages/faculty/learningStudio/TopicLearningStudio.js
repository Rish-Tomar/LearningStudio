import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Typography,
} from "@mui/material";

import { useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import api from "../../../api/axios";

import LearningContentSection
    from "../../../components/learningStudio/LearningContentSection";

import LearningActivitySection
    from "../../../components/learningStudio/LearningActivitySection";


const TopicLearningStudio = () => {

    const { topicId } = useParams();


    const [studio, setStudio] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const fetchLearningStudio = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await api.get(
                `/learning-studio/topics/${topicId}`
            );


            setStudio(response.data.data);


        } catch (error) {

            console.error(
                "Failed to fetch Learning Studio:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to load Learning Studio"
            );


        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchLearningStudio();

    }, [topicId]);


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


    if (error) {

        return (

            <DashboardLayout>

                <Alert severity="error">
                    {error}
                </Alert>

            </DashboardLayout>

        );

    }


    if (!studio) {

        return null;

    }


    const {
        topic,
        content,
        activities,
    } = studio;


    return (

        <DashboardLayout>

            <Box>

                {/* Page Header */}

                <Box sx={{ mb: 4 }}>

                    <Typography
                        variant="h4"
                        fontWeight={600}
                    >
                        {topic.name}
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        {topic.description ||
                            "Manage learning content and activities"}
                    </Typography>


                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            mt: 2,
                        }}
                    >

                        <Chip
                            label={`Module: ${
                                topic.module?.name || "—"
                            }`}
                            variant="outlined"
                        />


                        <Chip
                            label={`Course: ${
                                topic.module?.course?.name || "—"
                            }`}
                            variant="outlined"
                        />

                    </Box>

                </Box>


                {/* Learning Content */}

                <LearningContentSection
                    content={content}
                    topicId={topic._id}
                    onStatusChanged={fetchLearningStudio}
                />


                {/* Learning Activities */}

                <LearningActivitySection
                    activities={activities}
                    topicId={topic._id}
                    onStatusChanged={fetchLearningStudio}
                />

            </Box>

        </DashboardLayout>

    );

};


export default TopicLearningStudio;