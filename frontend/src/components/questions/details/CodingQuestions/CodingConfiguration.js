import {
    Box,
    Card,
    CardContent,
    Chip,
    Typography,
} from "@mui/material";


const CodingConfiguration = ({
    allowedLanguages,
    executionTimeLimit,
    memoryLimit,
}) => {

    return (

        <Card sx={{ mb: 3 }}>

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                >
                    Coding Configuration
                </Typography>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        mb: 3,
                    }}
                >

                    {allowedLanguages?.map(
                        (language) => (

                            <Chip
                                key={language}
                                label={language}
                                variant="outlined"
                            />

                        )
                    )}

                </Box>


                <Box
                    sx={{
                        display: "flex",
                        gap: 6,
                    }}
                >

                    <Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Execution Time
                        </Typography>


                        <Typography
                            fontWeight={600}
                        >
                            {executionTimeLimit} ms
                        </Typography>

                    </Box>


                    <Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Memory Limit
                        </Typography>


                        <Typography
                            fontWeight={600}
                        >
                            {memoryLimit} MB
                        </Typography>

                    </Box>

                </Box>

            </CardContent>

        </Card>

    );

};


export default CodingConfiguration;