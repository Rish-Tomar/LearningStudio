import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import topicService from "../../../services/topicService";

const ModuleTopicList = () => {

    const { moduleId } = useParams();

    const navigate = useNavigate();

    const [topics, setTopics] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        const fetchTopics = async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await topicService.getTopicsByModule(
                        moduleId
                    );

                setTopics(
                    response.data || []
                );

            } catch (error) {

                console.error(
                    "Failed to fetch module topics:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load topics"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchTopics();

    }, [moduleId]);

    const handleCreateTopic = () => {

        navigate(
            `/faculty/modules/${moduleId}/topics/create`
        );

    };

    return (

        <DashboardLayout>

            <Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >

                    <Box>

                        <Typography
                            variant="h4"
                            fontWeight={600}
                        >
                            Topics
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Manage topics for this module
                        </Typography>

                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateTopic}
                    >
                        Create Topic
                    </Button>

                </Box>

                {loading && (

                    <Typography>
                        Loading topics...
                    </Typography>

                )}

                {error && (

                    <Alert severity="error">
                        {error}
                    </Alert>

                )}

                {!loading &&
                    !error &&
                    topics.length === 0 && (

                        <Alert severity="info">
                            No topics have been added to this module yet.
                        </Alert>

                    )}

                {!loading &&
                    !error &&
                    topics.length > 0 && (

                        <Box>

                            {topics.map((topic) => (

                                <Box
                                    key={topic._id}
                                    sx={{
                                        p: 2,
                                        mb: 2,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 1,
                                    }}
                                >

                                    <Typography
                                        variant="h6"
                                        fontWeight={600}
                                    >
                                        {topic.sequence}.{" "}
                                        {topic.name}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {topic.code}
                                    </Typography>

                                    {topic.description && (

                                        <Typography
                                            variant="body2"
                                            sx={{ mt: 1 }}
                                        >
                                            {topic.description}
                                        </Typography>

                                    )}

                                </Box>

                            ))}

                        </Box>

                    )}

            </Box>

        </DashboardLayout>

    );
};

export default ModuleTopicList;