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

import MenuBookIcon from "@mui/icons-material/MenuBook";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";


const LearningContentSection = ({
    content = [],
    topicId,
}) => {

    const navigate = useNavigate();

    return (

        <Card
            elevation={2}
            sx={{ mb: 3 }}
        >

            <CardContent>

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

                        <MenuBookIcon
                            color="primary"
                        />

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            Learning Content
                        </Typography>

                    </Box>

                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() =>
                            navigate(
                                `/faculty/topics/${topicId}/learning-studio/content/create`
                            )
                        }
                    >
                        Add Content
                    </Button>
                    

                </Box>

                <Divider />

                {content.length === 0 ? (

                    <Typography
                        color="text.secondary"
                        sx={{ py: 3 }}
                    >
                        No learning content yet.
                    </Typography>

                ) : (

                    <List>

                        {content.map((item) => (

                            <ListItem
                                key={item._id}
                                divider
                            >

                                <ListItemText
                                    primary={
                                        `${item.sequence}. ${item.title}`
                                    }
                                    secondary={
                                        `Completion Weight: ${item.completionWeight}%`
                                    }
                                />

                                <Chip
                                    label={item.status}
                                    size="small"
                                    color={
                                        item.status === "ACTIVE"
                                            ? "success"
                                            : "default"
                                    }
                                />
                                <Button
                                    sx={{px:3,borderLeft:1}}
                                    variant="outlined"
                                    size="small"
                                    onClick={() =>
                                        navigate(
                                            `/faculty/topics/${topicId}/learning-studio/content/${content._id}/edit`
                                        )
                                    }
                                >
                                    Edit
                                </Button>

                            </ListItem>

                        ))}

                    </List>

                )}

            </CardContent>

        </Card>

    );

};


export default LearningContentSection;