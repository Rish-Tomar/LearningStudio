import { useEffect, useState } from "react";

import {
    Typography,
    Box,
    Button
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DashboardLayout from "../../../layouts/DashboardLayout";
import topicService from "../../../services/topicService";
import TopicTable from "../../../components/topics/TopicTable";

const TopicList = () => {

    const [topics, setTopics] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        const fetchTopics = async () => {

            try {

                setLoading(true);

                const response = await topicService.getTopics();

                setTopics(response.data);

            } catch (error) {

                console.error("Failed to fetch topics:", error);

                setError(
                    "Failed to load topics"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchTopics();

    }, []);

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
                            Manage your topics and their status
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
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
                    <Typography color="error">
                        {error}
                    </Typography>
                )}

                {!loading && !error && (

                    <TopicTable topics={topics} />

                )}

            </Box>

        </DashboardLayout>

    );
};

export default TopicList;