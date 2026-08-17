import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Card,
    Button,
    Chip,
    CircularProgress,
    Typography,
    CardContent,
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


            const response =
                await api.get(
                    `/learning-studio/topics/${topicId}`
                );


            setStudio(
                response.data.data
            );


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


    /*
     * Calculate active Learning Content weight
     */

    const activeContentWeight =
        content
            .filter(
                (item) =>
                    item.status === "ACTIVE"
            )
            .reduce(
                (total, item) =>
                    total +
                    Number(
                        item.completionWeight || 0
                    ),
                0
            );


    /*
     * Calculate active Learning Activity weight
     */

    const activeActivityWeight =
        activities
            .filter(
                (activity) =>
                    activity.status === "ACTIVE"
            )
            .reduce(
                (total, activity) =>
                    total +
                    Number(
                        activity.completionWeight || 0
                    ),
                0
            );


    /*
     * Calculate total active weight
     */

    const totalActiveWeight =
        activeContentWeight +
        activeActivityWeight;


    /*
     * Calculate remaining weight
     */

    const remainingWeight =
        Math.max(
            0,
            100 - totalActiveWeight
        );


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
                            label={
                                `Module: ${
                                    topic.module?.name ||
                                    "—"
                                }`
                            }
                            variant="outlined"
                        />


                        <Chip
                            label={
                                `Course: ${
                                    topic.module?.course?.name ||
                                    "—"
                                }`
                            }
                            variant="outlined"
                        />

                    </Box>

                </Box>

                 {/* Completion Weight Summary */}

                <Card
                    elevation={2}
                    sx={{ mb: 3 }}
                >

                    <CardContent>

                        <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{ mb: 2 }}
                        >
                            Completion Weight
                        </Typography>


                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr 1fr",
                                    sm: "repeat(4, 1fr)",
                                },
                                gap: 2,
                            }}
                        >

                            <Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Learning Content
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                >
                                    {activeContentWeight}%
                                </Typography>

                            </Box>


                            <Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Learning Activities
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                >
                                    {activeActivityWeight}%
                                </Typography>

                            </Box>


                            <Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Total Active
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                >
                                    {totalActiveWeight}%
                                </Typography>

                            </Box>


                            <Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Remaining
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                >
                                    {remainingWeight}%
                                </Typography>

                            </Box>

                        </Box>

                    </CardContent>

                </Card>

                {/* Learning Content */}

                <LearningContentSection
                    content={content}
                    topicId={topic._id}
                />

               


                {/* Learning Activities */}

                <LearningActivitySection
                    activities={activities}
                    topicId={topic._id}
                    onStatusChanged={
                        fetchLearningStudio
                    }
                />

            </Box>

        </DashboardLayout>

    );

};


export default TopicLearningStudio;