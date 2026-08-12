import {
    Card,
    CardContent,
    Chip,
    Typography,
} from "@mui/material";


const MCQAnswer = ({
    correctAnswer,
    explanation,
}) => {

    return (

        <Card sx={{ mb: 3 }}>

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                >
                    Correct Answer
                </Typography>


                <Chip
                    label={
                        correctAnswer || "-"
                    }
                    color="success"
                />


                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mt: 3 }}
                    gutterBottom
                >
                    Explanation
                </Typography>


                <Typography
                    sx={{
                        whiteSpace: "pre-line",
                    }}
                >
                    {explanation || "-"}
                </Typography>

            </CardContent>

        </Card>

    );

};


export default MCQAnswer;