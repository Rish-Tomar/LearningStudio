import {
    Box,
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


const LearningActivitySection = ({
    activities = [],
}) => {

    return (

        <Card elevation={2}>

            <CardContent>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
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

                <Divider />

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

                                <ListItemText
                                    primary={
                                        `${activity.sequence}. ${activity.question?.title || "Question"}`
                                    }
                                    secondary={
                                        `${activity.question?.code || ""} • Completion Weight: ${activity.completionWeight}%`
                                    }
                                />

                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}
                                >

                                    <Chip
                                        label={
                                            activity.question?.questionType ||
                                            "—"
                                        }
                                        size="small"
                                    />

                                    <Chip
                                        label={
                                            activity.question?.difficulty ||
                                            "—"
                                        }
                                        size="small"
                                        variant="outlined"
                                    />

                                    <Chip
                                        label={activity.status}
                                        size="small"
                                        color={
                                            activity.status === "ACTIVE"
                                                ? "success"
                                                : "default"
                                        }
                                    />

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