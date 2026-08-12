import {
    Box,
    Card,
    CardContent,
    Chip,
    Typography,
} from "@mui/material";


const QuestionBasicInfo = ({
    question,
}) => {

    return (

        <Card sx={{ mb: 3 }}>

            <CardContent>

                <Typography
                    variant="h5"
                    fontWeight={600}
                    gutterBottom
                >
                    {question.title}
                </Typography>


                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    {question.code}
                </Typography>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        mb: 2,
                    }}
                >

                    <Chip
                        label={
                            question.questionType
                        }
                        color={
                            question.questionType ===
                            "MCQ"
                                ? "primary"
                                : "secondary"
                        }
                    />


                    <Chip
                        label={
                            question.difficulty
                        }
                        variant="outlined"
                    />


                    <Chip
                        label={
                            question.status
                        }
                        color={
                            question.status ===
                            "ACTIVE"
                                ? "success"
                                : "default"
                        }
                    />

                </Box>


                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Topic
                </Typography>


                <Typography
                    variant="body1"
                    sx={{ mb: 2 }}
                >
                    {question.topic?.name || "-"}
                </Typography>


                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Description
                </Typography>


                <Typography
                    variant="body1"
                    sx={{
                        mt: 0.5,
                        whiteSpace: "pre-line",
                    }}
                >
                    {
                        question.description ||
                        "-"
                    }
                </Typography>

            </CardContent>

        </Card>

    );

};


export default QuestionBasicInfo;