import {
    Card,
    CardContent,
    Divider,
    Typography,
} from "@mui/material";


const CodingInputOutput = ({
    inputFormat,
    outputFormat,
}) => {

    return (

        <Card sx={{ mb: 3 }}>

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                >
                    Input Format
                </Typography>


                <Typography
                    sx={{
                        whiteSpace: "pre-line",
                        mb: 3,
                    }}
                >
                    {inputFormat || "-"}
                </Typography>


                <Divider sx={{ mb: 3 }} />


                <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                >
                    Output Format
                </Typography>


                <Typography
                    sx={{
                        whiteSpace: "pre-line",
                    }}
                >
                    {outputFormat || "-"}
                </Typography>

            </CardContent>

        </Card>

    );

};


export default CodingInputOutput;