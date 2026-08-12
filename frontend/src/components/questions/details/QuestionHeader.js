import {
    Box,
    Typography,
} from "@mui/material";


const QuestionHeader = () => {

    return (

        <Box sx={{ mb: 3 }}>

            <Typography
                variant="h4"
                fontWeight={600}
            >
                Question Details
            </Typography>


            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
            >
                View question information
            </Typography>

        </Box>

    );

};


export default QuestionHeader;