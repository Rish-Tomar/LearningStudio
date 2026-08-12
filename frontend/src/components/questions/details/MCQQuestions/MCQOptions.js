import {
    Box,
    Card,
    CardContent,
    Chip,
    Typography,
} from "@mui/material";


const MCQOptions = ({
    options,
}) => {

    return (

        <Card sx={{ mb: 3 }}>

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                >
                    Options
                </Typography>


                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                    }}
                >

                    {options?.map((option) => (

                        <Box
                            key={option._id}
                            sx={{
                                display: "flex",
                                gap: 2,
                                alignItems: "center",
                                p: 1.5,
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 1,
                            }}
                        >

                            <Chip
                                label={option.key}
                                size="small"
                            />


                            <Typography>
                                {option.text}
                            </Typography>

                        </Box>

                    ))}

                </Box>

            </CardContent>

        </Card>

    );

};


export default MCQOptions;