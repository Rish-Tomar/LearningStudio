import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import enrollmentService from "../../services/enrollmentService";


const StudentCourses = () => {

    const navigate = useNavigate();

    const [enrollments, setEnrollments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchMyCourses = async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await enrollmentService.getMyEnrollments();

                setEnrollments(response.data || []);

            } catch (error) {

                console.error(
                    "Failed to fetch enrolled courses:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load your courses"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchMyCourses();

    }, []);


    const handleOpenCourse = (courseId) => {

        navigate(
            `/student/courses/${courseId}`
        );

    };


    return (

        <DashboardLayout>

            <Box>

                <Box sx={{ mb: 4 }}>

                    <Typography
                        variant="h4"
                        fontWeight={600}
                    >
                        My Courses
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        View and continue learning in your enrolled courses
                    </Typography>

                </Box>


                {loading && (

                    <Typography>
                        Loading your courses...
                    </Typography>

                )}


                {error && (

                    <Alert severity="error">
                        {error}
                    </Alert>

                )}


                {!loading && !error && enrollments.length === 0 && (

                    <Alert severity="info">
                        You are not enrolled in any courses yet.
                    </Alert>

                )}


                {!loading && !error && enrollments.length > 0 && (

                    <Grid
                        container
                        spacing={3}
                    >

                        {enrollments.map((enrollment) => {

                            const course =
                                enrollment.course;

                            if (!course) {
                                return null;
                            }

                            return (

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={enrollment._id}
                                >

                                    <Card
                                        sx={{
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >

                                        <CardContent
                                            sx={{
                                                flexGrow: 1,
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    mb: 2,
                                                }}
                                            >

                                                <SchoolIcon
                                                    color="primary"
                                                    sx={{
                                                        mr: 1.5,
                                                        fontSize: 32,
                                                    }}
                                                />

                                                <Typography
                                                    variant="h6"
                                                    fontWeight={600}
                                                >
                                                    {course.name}
                                                </Typography>

                                            </Box>


                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mb: 1 }}
                                            >
                                                Course Code: {course.code}
                                            </Typography>


                                            {course.description && (

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mb: 2,
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {course.description}
                                                </Typography>

                                            )}

                                        </CardContent>


                                        <Box
                                            sx={{
                                                px: 2,
                                                pb: 2,
                                            }}
                                        >

                                            <Button
                                                fullWidth
                                                variant="contained"
                                                endIcon={<ArrowForwardIcon />}
                                                onClick={() =>
                                                    handleOpenCourse(
                                                        course._id
                                                    )
                                                }
                                            >
                                                Open Course
                                            </Button>

                                        </Box>

                                    </Card>

                                </Grid>

                            );

                        })}

                    </Grid>

                )}

            </Box>

        </DashboardLayout>

    );

};


export default StudentCourses;