import {
    Card,
    CardActionArea,
    Typography,
    Box,
} from "@mui/material";

const ActionCard = ({ action }) => {

    const Icon = action.icon;

    return (
        <Card
            elevation={2}
            sx={{
                borderRadius: 3,
                transition: "all 0.25s ease",

                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 8,
                },
            }}
        >
            <CardActionArea
                sx={{
                    height: 150,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 2,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    <Icon
                        color="primary"
                        sx={{
                            fontSize: 48,
                            mb: 2,
                        }}
                    />

                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        align="center"
                        sx={{
                            width: "100%",
                            lineHeight: 1.3,
                        }}
                    >
                        {action.title}
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        align="center"
                        sx={{
                            mt: 1,
                            width: "100%",
                            lineHeight: 1.4,
                        }}
                    >
                        {action.description}
                    </Typography>

                </Box>
            </CardActionArea>
        </Card>
    );
};

export default ActionCard;