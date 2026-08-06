import { Box, Paper, Typography } from "@mui/material";

const AuthLayout = ({ title, subtitle, children }) => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "background.default",
                px: 2,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: "100%",
                    maxWidth: 430,
                    p: 5,
                    borderRadius: 3,
                }}
            >
                <Box textAlign="center" mb={4}>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="primary"
                    >
                        CodingPlate
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={1}
                    >
                        Online Coding Assessment Platform
                    </Typography>
                </Box>

                <Typography
                    variant="h5"
                    fontWeight={600}
                    gutterBottom
                >
                    {title}
                </Typography>

                {subtitle && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={3}
                    >
                        {subtitle}
                    </Typography>
                )}

                {children}
            </Paper>
        </Box>
    );
};

export default AuthLayout;