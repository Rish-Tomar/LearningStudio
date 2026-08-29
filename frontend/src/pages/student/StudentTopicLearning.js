import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";

import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";

import { useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import api from "../../api/axios";


const StudentTopicLearning = () => {

    const { topicId } = useParams();

    const [studio, setStudio] = useState(null);

    const [selectedItem, setSelectedItem] = useState(null);

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

            const data = response.data.data;

            setStudio(data);

            if (data.content?.length > 0) {

                setSelectedItem({
                    type: "content",
                    data: data.content[0],
                });

            } else if (data.activities?.length > 0) {

                setSelectedItem({
                    type: "activity",
                    data: data.activities[0],
                });

            }

        } catch (error) {

            console.error(
                "Failed to fetch Learning Studio:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load learning material"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchLearningStudio();

    }, [topicId]);


    const handleContentSelect = (content) => {

        setSelectedItem({
            type: "content",
            data: content,
        });

    };


    const handleActivitySelect = (activity) => {

        setSelectedItem({
            type: "activity",
            data: activity,
        });

    };


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
        content = [],
        activities = [],
    } = studio;


    return (

        <DashboardLayout>

            <Box
                sx={{
                    display: "flex",
                    height: "calc(100vh - 112px)",
                    overflow: "hidden",
                }}
            >

                {/* =========================================
                    SECONDARY SIDEBAR
                ========================================= */}

                <Box
                    sx={{
                        width: 300,
                        flexShrink: 0,
                        border: "1px solid",
                        borderColor: "divider",
                        backgroundColor: "background.paper",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >

                    {/* Sidebar Header */}

                    <Box
                        sx={{
                            px: 2.5,
                            py: 2,
                            flexShrink: 0,
                        }}
                    >

                        <Typography
                            variant="subtitle1"
                            fontWeight={500}
                        >
                            LEARNING MATERIAL
                        </Typography>

                    </Box>


                    {/* Scrollable Sidebar Content */}

                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: "auto",
                        }}
                    >

                        {/* Learning Content */}

                        {content.length > 0 && (

                            <Box>

                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        px: 2.5,
                                        py: 1.5,
                                    }}
                                >
                                    LEARNING CONTENT
                                </Typography>


                                <List disablePadding>

                                    {content.map((item) => {

                                        const isSelected =
                                            selectedItem?.type === "content" &&
                                            selectedItem?.data?._id === item._id;

                                        return (

                                            <ListItemButton
                                                key={item._id}
                                                selected={isSelected}
                                                onClick={() =>
                                                    handleContentSelect(item)
                                                }
                                                sx={{
                                                    minHeight: 56,
                                                    px: 2.5,

                                                    "&.Mui-selected": {
                                                        backgroundColor:
                                                            "action.selected",
                                                        borderLeft:
                                                            "3px solid",
                                                        borderColor:
                                                            "primary.main",
                                                        pl: "calc(20px - 3px)",
                                                    },

                                                    "&.Mui-selected:hover": {
                                                        backgroundColor:
                                                            "action.selected",
                                                    },
                                                }}
                                            >

                                                <ListItemIcon
                                                    sx={{
                                                        minWidth: 42,
                                                    }}
                                                >

                                                    <MenuBookOutlinedIcon
                                                        fontSize="small"
                                                        color={
                                                            isSelected
                                                                ? "primary"
                                                                : "inherit"
                                                        }
                                                    />

                                                </ListItemIcon>

                                                <ListItemText
                                                    primary={item.title}
                                                    primaryTypographyProps={{
                                                        noWrap: true,
                                                    }}
                                                />

                                            </ListItemButton>

                                        );

                                    })}

                                </List>

                            </Box>

                        )}


                        {content.length > 0 &&
                            activities.length > 0 && (
                                <Divider sx={{ mt: 1 }} />
                            )}


                        {/* Learning Activities */}

                        {activities.length > 0 && (

                            <Box>

                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        px: 2.5,
                                        py: 1.5,
                                    }}
                                >
                                    ACTIVITIES
                                </Typography>


                                <List disablePadding>

                                    {activities.map((activity) => {

                                        const isSelected =
                                            selectedItem?.type === "activity" &&
                                            selectedItem?.data?._id === activity._id;

                                        return (

                                            <ListItemButton
                                                key={activity._id}
                                                selected={isSelected}
                                                onClick={() =>
                                                    handleActivitySelect(activity)
                                                }
                                                sx={{
                                                    minHeight: 56,
                                                    px: 2.5,

                                                    "&.Mui-selected": {
                                                        backgroundColor:
                                                            "action.selected",
                                                        borderLeft:
                                                            "3px solid",
                                                        borderColor:
                                                            "primary.main",
                                                        pl: "calc(20px - 3px)",
                                                    },

                                                    "&.Mui-selected:hover": {
                                                        backgroundColor:
                                                            "action.selected",
                                                    },
                                                }}
                                            >

                                                <ListItemIcon
                                                    sx={{
                                                        minWidth: 42,
                                                    }}
                                                >

                                                    <CodeOutlinedIcon
                                                        fontSize="small"
                                                        color={
                                                            isSelected
                                                                ? "primary"
                                                                : "inherit"
                                                        }
                                                    />

                                                </ListItemIcon>

                                                <ListItemText
                                                    primary={
                                                        activity.question?.title ||
                                                        "Learning Activity"
                                                    }
                                                    primaryTypographyProps={{
                                                        noWrap: true,
                                                    }}
                                                />

                                            </ListItemButton>

                                        );

                                    })}

                                </List>

                            </Box>

                        )}

                    </Box>

                </Box>


                {/* =========================================
                    RIGHT LEARNING AREA
                ========================================= */}

                <Box
                    sx={{
                        flexGrow: 1,
                        minWidth: 0,
                        overflowY: "auto",
                        px: {
                            xs: 2,
                            md: 4,
                        },
                        py: 2,
                    }}
                >

                    {/* Topic Header */}

                    <Box sx={{ mb: 4 }}>

                        <Typography
                            variant="h3"
                            fontWeight={500}
                        >
                            {topic.name}
                        </Typography>


                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            {topic.description ||
                                "Learning material for this topic."}
                        </Typography>


                        <Box
                            sx={{
                                display: "flex",
                                gap: 1,
                                mt: 2,
                                flexWrap: "wrap",
                            }}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Module:{" "}
                                <strong>
                                    {topic.module?.name || "—"}
                                </strong>
                            </Typography>


                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Course:{" "}
                                <strong>
                                    {topic.module?.course?.name || "—"}
                                </strong>
                            </Typography>

                        </Box>

                    </Box>


                    <Divider sx={{ mb: 4 }} />


                    {/* Selected Learning Material */}

                    {selectedItem && (

                        <Box>

                            <Typography
                                variant="h4"
                                fontWeight={500}
                                sx={{ mb: 3 }}
                            >
                                {selectedItem.type === "content"
                                    ? selectedItem.data.title
                                    : selectedItem.data.question?.title ||
                                      "Learning Activity"}
                            </Typography>


                            {selectedItem.type === "content" && (

                                <Typography
                                    component="div"
                                    sx={{
                                        lineHeight: 1.8,
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    {selectedItem.data.content}
                                </Typography>

                            )}


                            {selectedItem.type === "activity" && (

                                <Box>

                                    <Typography
                                        variant="body1"
                                        sx={{ mb: 3 }}
                                    >
                                        {selectedItem.data.question?.description ||
                                            "Solve the following problem."}
                                    </Typography>


                                    {selectedItem.data.question?.constraints && (

                                        <Box sx={{ mb: 3 }}>

                                            <Typography
                                                variant="h6"
                                                sx={{ mb: 1 }}
                                            >
                                                Constraints
                                            </Typography>

                                            <Typography
                                                component="div"
                                                sx={{
                                                    whiteSpace: "pre-wrap",
                                                }}
                                            >
                                                {
                                                    selectedItem.data.question
                                                        .constraints
                                                }
                                            </Typography>

                                        </Box>

                                    )}

                                </Box>

                            )}

                        </Box>

                    )}


                    {!selectedItem && (

                        <Typography
                            color="text.secondary"
                        >
                            No learning material available for this topic.
                        </Typography>

                    )}

                </Box>

            </Box>

        </DashboardLayout>

    );

};


export default StudentTopicLearning;