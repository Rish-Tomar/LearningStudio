import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";

import DashboardLayout from "../../layouts/DashboardLayout";

import { useAuth } from "../../contexts/AuthContext";

const StudentDashboard = () => {

    const { auth } = useAuth();

    const studentName = auth?.user?.name || "Student";

    return (

        <DashboardLayout>

            {/* Welcome Section */}
            <Box sx={{ mb: 4 }}>

                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 600,
                        mb: 1,
                    }}
                >
                    Welcome back, {studentName}!
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                >
                    Continue your learning journey and keep making progress.
                </Typography>

            </Box>

            {/* My Courses Section */}
            <Box>

                <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                        fontWeight: 600,
                        mb: 2,
                    }}
                >
                    My Courses
                </Typography>

                <Grid
                    container
                    spacing={3}
                >

                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={4}
                    >

                        <Card
                            sx={{
                                height: "100%",
                                borderRadius: 2,
                            }}
                        >

                            <CardContent
                                sx={{
                                    minHeight: 180,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    p: 4,
                                }}
                            >

                                <SchoolIcon
                                    sx={{
                                        fontSize: 48,
                                        mb: 2,
                                        color: "text.secondary",
                                    }}
                                />

                                <Typography
                                    variant="h6"
                                    sx={{ mb: 1 }}
                                >
                                    No courses available yet
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Your enrolled courses will appear here.
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                </Grid>

            </Box>

        </DashboardLayout>

    );

};

export default StudentDashboard;