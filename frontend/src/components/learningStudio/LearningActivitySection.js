import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";

import QuizIcon from "@mui/icons-material/Quiz";
import AddIcon from "@mui/icons-material/Add";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import learningActivityService
    from "../../services/learningActivityService";


const LearningActivitySection = ({
    activities = [],
    topicId,
    onStatusChanged,
}) => {

    const navigate = useNavigate();

    const [statusLoadingId, setStatusLoadingId] =
        useState(null);


    const handleStatusChange = async (
        activityId,
        currentStatus
    ) => {

        console.log(
        "STATUS BUTTON CLICKED:",
        activityId,
        currentStatus
    );

        try {

            setStatusLoadingId(activityId);


            const newStatus =
                currentStatus === "ACTIVE"
                    ? "INACTIVE"
                    : "ACTIVE";


            await learningActivityService
                .updateLearningActivityStatus(
                    activityId,
                    newStatus
                );


            if (onStatusChanged) {

                await onStatusChanged();

            }


        } catch (error) {

            console.error(
                "Failed to update learning activity status:",
                error
            );


        } finally {

            setStatusLoadingId(null);

        }

    };


    return (

        <Card elevation={2}>

            <CardContent>

                {/* Section Header */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >

                        <QuizIcon
                            color="primary"
                        />

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            Learning Activities
                        </Typography>

                    </Box>


                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() =>
                            navigate(
                                `/faculty/topics/${topicId}/learning-studio/activity/create`
                            )
                        }
                    >
                        Add Activity
                    </Button>

                </Box>


                <Divider />


                {/* No Activities */}

                {activities.length === 0 ? (

                    <Typography
                        color="text.secondary"
                        sx={{ py: 3 }}
                    >
                        No learning activities yet.
                    </Typography>

                ) : (

                    <List>

                        {activities.map((activity) => (

                            <ListItem
                                key={activity._id}
                                divider
                            >

                                {/* Activity Information */}

                                <ListItemText
                                    primary={
                                        `${activity.sequence}. ${
                                            activity.question?.title ||
                                            "Question"
                                        }`
                                    }
                                    secondary={
                                        `${
                                            activity.question?.code ||
                                            ""
                                        } • Completion Weight: ${
                                            activity.completionWeight
                                        }%`
                                    }
                                />


                                {/* Activity Actions / Information */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >

                                    {/* Question Type */}

                                    <Chip
                                        label={
                                            activity.question
                                                ?.questionType ||
                                            "—"
                                        }
                                        size="small"
                                    />


                                    {/* Difficulty */}

                                    <Chip
                                        label={
                                            activity.question
                                                ?.difficulty ||
                                            "—"
                                        }
                                        size="small"
                                        variant="outlined"
                                    />


                                    {/* Status */}

                                    <Chip
                                        label={activity.status}
                                        size="small"
                                        color={
                                            activity.status === "ACTIVE"
                                                ? "success"
                                                : "default"
                                        }
                                    />


                                    {/* Activate / Deactivate */}

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color={
                                            activity.status === "ACTIVE"
                                                ? "warning"
                                                : "success"
                                        }
                                        disabled={
                                            statusLoadingId ===
                                            activity._id
                                        }
                                        onClick={() =>
                                            handleStatusChange(
                                                activity._id,
                                                activity.status
                                            )
                                        }
                                    >

                                        {
                                            statusLoadingId ===
                                            activity._id

                                                ? "Updating..."

                                                : activity.status ===
                                                  "ACTIVE"

                                                    ? "Deactivate"

                                                    : "Activate"
                                        }

                                    </Button>


                                    {/* Edit */}

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() =>
                                            navigate(
                                                `/faculty/topics/${topicId}/learning-studio/activity/${activity._id}/edit`
                                            )
                                        }
                                    >
                                        Edit
                                    </Button>

                                </Box>

                            </ListItem>

                        ))}

                    </List>

                )}

            </CardContent>

        </Card>

    );

};


export default LearningActivitySection;