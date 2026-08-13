import { useEffect, useState } from "react";

import {
    Typography,
    Box,
    Button
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import DashboardLayout from "../../../layouts/DashboardLayout";

import courseService from "../../../services/courseService";

import CourseTable from "../../../components/courses/CourseTable";

import { useNavigate } from "react-router-dom";

const CourseList = () => {

    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        const fetchCourses = async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await courseService.getCourses();

                setCourses(response.data);

            } catch (error) {

                console.error(
                    "Failed to fetch courses:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load courses"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchCourses();

    }, []);

    return (

        <DashboardLayout>

            <Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >

                    <Box>

                        <Typography
                            variant="h4"
                            fontWeight={600}
                        >
                            Courses
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Manage your courses and their status
                        </Typography>

                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() =>
                            navigate("/faculty/courses/create")
                        }
                    >
                        Create Course
                    </Button>

                </Box>

                {loading && (

                    <Typography>
                        Loading courses...
                    </Typography>

                )}

                {error && (

                    <Typography color="error">
                        {error}
                    </Typography>

                )}

                {!loading && !error && (

                    <CourseTable
                        courses={courses}
                    />

                )}

            </Box>

        </DashboardLayout>

    );
};

export default CourseList;