import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Typography,
} from "@mui/material";


const TestCaseCard = ({
    testCase,
}) => {

    return (

        <Card
            variant="outlined"
        >

            <CardContent>

                {/* Header */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >

                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                    >
                        Test Case{" "}
                        {testCase.executionOrder}
                    </Typography>


                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                        }}
                    >

                        <Chip
                            label={
                                testCase.visibility
                            }
                            size="small"
                            color={
                                testCase.visibility ===
                                "PUBLIC"
                                    ? "success"
                                    : "default"
                            }
                        />


                        <Chip
                            label={`Weight: ${
                                testCase.weight
                            }`}
                            size="small"
                            variant="outlined"
                        />

                    </Box>

                </Box>


                <Divider
                    sx={{ mb: 2 }}
                />


                {/* Input */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    Input
                </Typography>


                <Box
                    sx={{
                        p: 1.5,
                        mb: 2,
                        bgcolor: "action.hover",
                        borderRadius: 1,
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {testCase.input}
                </Box>


                {/* Expected Output */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    Expected Output
                </Typography>


                <Box
                    sx={{
                        p: 1.5,
                        bgcolor: "action.hover",
                        borderRadius: 1,
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {testCase.expectedOutput}
                </Box>

            </CardContent>

        </Card>

    );

};


export default TestCaseCard;