import { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Divider,
    Alert,
    CircularProgress
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";

import DashboardLayout from "../../layouts/DashboardLayout";

import { useAuth } from "../../contexts/AuthContext";

import courseService from "../../services/courseService";

import enrollmentService
    from "../../services/enrollmentService";


const StudentDashboard = () => {

    const { auth } = useAuth();

    const studentName =
        auth?.user?.name || "Student";


    /*
     * Available courses
     */
    const [courses, setCourses] = useState([]);

    const [coursesLoading, setCoursesLoading] =
        useState(false);

    const [coursesError, setCoursesError] =
        useState("");

    /*
    * Student's active enrollments
    */
    const [myEnrollments, setMyEnrollments] =
        useState([]);

    const [enrollmentsLoading, setEnrollmentsLoading] =
        useState(false);

    const [enrollmentsError, setEnrollmentsError] =
        useState("");

    /*
     * Join Course Dialog
     */
    const [joinDialogOpen, setJoinDialogOpen] =
        useState(false);


    /*
     * Selected course
     */
    const [selectedCourse, setSelectedCourse] =
        useState("");


    /*
     * Classroom code
     */
    const [classroomCode, setClassroomCode] =
        useState("");


    /*
     * Request state
     */
    const [requestLoading, setRequestLoading] =
        useState(false);

    const [requestError, setRequestError] =
        useState("");

    const [requestSuccess, setRequestSuccess] =
        useState("");


    /*
     * Fetch available courses
     *
     * We reuse the existing course API.
     */
    useEffect(() => {

        const fetchCourses = async () => {

            try {

                setCoursesLoading(true);

                setCoursesError("");

                const response =
                    await courseService.getCourses();

                setCourses(response.data || []);

            } catch (error) {

                console.error(
                    "Failed to fetch courses:",
                    error
                );

                setCoursesError(
                    error.response?.data?.message ||
                    "Failed to load courses"
                );

            } finally {

                setCoursesLoading(false);

            }

        };

        fetchCourses();

    }, []);

    /*
    * Fetch student's active enrollments.
    */
    useEffect(() => {

        const fetchMyEnrollments = async () => {

            try {

                setEnrollmentsLoading(true);
                setEnrollmentsError("");

                const response =
                    await enrollmentService
                        .getMyEnrollments();

                setMyEnrollments(
                    response.data || []
                );

            } catch (error) {

                console.error(
                    "Failed to fetch enrollments:",
                    error
                );

                setEnrollmentsError(
                    error.response?.data?.message ||
                    "Failed to load enrolled courses"
                );

            } finally {

                setEnrollmentsLoading(false);

            }

        };

        fetchMyEnrollments();

    }, []);

    /*
     * Open Join Course dialog
     */
    const handleOpenJoinDialog = () => {

        setSelectedCourse("");

        setClassroomCode("");

        setRequestError("");

        setRequestSuccess("");

        setJoinDialogOpen(true);

    };


    /*
     * Close Join Course dialog
     */
    const handleCloseJoinDialog = () => {

        if (requestLoading) {
            return;
        }

        setJoinDialogOpen(false);

        setSelectedCourse("");

        setClassroomCode("");

        setRequestError("");

        setRequestSuccess("");

    };


    /*
     * Submit enrollment request
     */
    const handleEnrollmentRequest = async () => {

        setRequestError("");

        setRequestSuccess("");


        /*
         * Course search / selection
         */
        if (selectedCourse) {

            try {

                setRequestLoading(true);

                await enrollmentService
                    .requestEnrollmentByCourse(
                        selectedCourse
                    );

                setRequestSuccess(
                    "Enrollment request submitted successfully. Waiting for faculty approval."
                );

                setSelectedCourse("");

            } catch (error) {

                console.error(
                    "Enrollment request failed:",
                    error
                );

                setRequestError(
                    error.response?.data?.message ||
                    "Failed to submit enrollment request"
                );

            } finally {

                setRequestLoading(false);

            }

            return;

        }


        /*
         * Classroom code
         */
        if (classroomCode.trim()) {

            try {

                setRequestLoading(true);

                await enrollmentService
                    .requestEnrollmentByClassroomCode(
                        classroomCode.trim()
                    );

                setRequestSuccess(
                    "Enrollment request submitted successfully. Waiting for faculty approval."
                );

                setClassroomCode("");

            } catch (error) {

                console.error(
                    "Enrollment request failed:",
                    error
                );

                setRequestError(
                    error.response?.data?.message ||
                    "Failed to submit enrollment request"
                );

            } finally {

                setRequestLoading(false);

            }

            return;

        }


        setRequestError(
            "Please select a course or enter a classroom code."
        );

    };


    return (

        <DashboardLayout>

            {/* Welcome Section */}

            <Box sx={{ mb: 4 }}>

                <Typography
                    variant="h4"
                    fontWeight={600}
                >
                    Welcome back, {studentName}!
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    Continue your learning journey.
                </Typography>

            </Box>


            {/* My Courses Section */}

            <Box>

                <Typography
                    variant="h5"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                >
                    My Courses
                </Typography>


                <Card>

                    <CardContent>

                    {enrollmentsLoading && (

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                py: 4
                            }}
                        >
                            <CircularProgress />
                        </Box>

                    )}

                    {!enrollmentsLoading &&
                        enrollmentsError && (

                            <Alert severity="error">
                                {enrollmentsError}
                            </Alert>

                        )}

                    {!enrollmentsLoading &&
                        !enrollmentsError &&
                        myEnrollments.length === 0 && (

                            <Box
                                sx={{
                                    textAlign: "center",
                                    py: 4
                                }}
                            >

                                <SchoolIcon
                                    color="primary"
                                    sx={{
                                        fontSize: 48,
                                        mb: 1
                                    }}
                                />

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                >
                                    No Courses Yet
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    You are not enrolled in any course yet.
                                </Typography>

                                <Button
                                    variant="contained"
                                    sx={{ mt: 2 }}
                                    onClick={handleOpenJoinDialog}
                                >
                                    Join a Course
                                </Button>

                            </Box>

                        )}

                    {!enrollmentsLoading &&
                        !enrollmentsError &&
                        myEnrollments.length > 0 && (

                            <Box>

                                {myEnrollments.map((enrollment) => (

                                    <Box
                                        key={enrollment._id}
                                        sx={{
                                            p: 2,
                                            mb: 2,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 2
                                        }}
                                    >

                                        <Typography
                                            variant="h6"
                                            fontWeight={600}
                                        >
                                            {enrollment.course?.name ||
                                                "Course"}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {enrollment.course?.code ||
                                                ""}
                                        </Typography>

                                    </Box>

                                ))}

                            </Box>

                        )}

                </CardContent>

                </Card>

            </Box>


            {/* Join Course Dialog */}

            <Dialog
                open={joinDialogOpen}
                onClose={handleCloseJoinDialog}
                fullWidth
                maxWidth="sm"
            >

                <DialogTitle>
                    Join a Course
                </DialogTitle>


                <DialogContent>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        Search for a course or use a classroom
                        code provided by your faculty.
                    </Typography>


                    {/* Course Selection */}

                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ mb: 1 }}
                    >
                        Search for a Course
                    </Typography>


                    <TextField
                        select
                        fullWidth
                        label="Select Course"
                        value={selectedCourse}
                        onChange={(event) => {

                            setSelectedCourse(
                                event.target.value
                            );

                            setClassroomCode("");

                            setRequestError("");

                            setRequestSuccess("");

                        }}
                        disabled={
                            coursesLoading ||
                            requestLoading
                        }
                    >

                        <MenuItem value="">
                            Select a course
                        </MenuItem>


                        {courses.map((course) => (

                            <MenuItem
                                key={course._id}
                                value={course._id}
                            >
                                {course.name} ({course.code})
                            </MenuItem>

                        ))}

                    </TextField>


                    {coursesLoading && (

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mt: 1
                            }}
                        >

                            <CircularProgress
                                size={18}
                            />

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Loading courses...
                            </Typography>

                        </Box>

                    )}


                    {coursesError && (

                        <Alert
                            severity="error"
                            sx={{ mt: 2 }}
                        >
                            {coursesError}
                        </Alert>

                    )}


                    {/* Divider */}

                    <Divider
                        sx={{ my: 3 }}
                    >

                        OR

                    </Divider>


                    {/* Classroom Code */}

                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ mb: 1 }}
                    >
                        Enter Classroom Code
                    </Typography>


                    <TextField
                        fullWidth
                        label="Classroom Code"
                        value={classroomCode}
                        onChange={(event) => {

                            setClassroomCode(
                                event.target.value
                            );

                            setSelectedCourse("");

                            setRequestError("");

                            setRequestSuccess("");

                        }}
                        disabled={requestLoading}
                        inputProps={{
                            style: {
                                textTransform: "uppercase"
                            }
                        }}
                    />


                    {/* Request Error */}

                    {requestError && (

                        <Alert
                            severity="error"
                            sx={{ mt: 3 }}
                        >
                            {requestError}
                        </Alert>

                    )}


                    {/* Request Success */}

                    {requestSuccess && (

                        <Alert
                            severity="success"
                            sx={{ mt: 3 }}
                        >
                            {requestSuccess}
                        </Alert>

                    )}

                </DialogContent>


                <DialogActions
                    sx={{ px: 3, pb: 2 }}
                >

                    <Button
                        onClick={
                            handleCloseJoinDialog
                        }
                        disabled={requestLoading}
                    >
                        Cancel
                    </Button>


                    <Button
                        variant="contained"
                        onClick={
                            handleEnrollmentRequest
                        }
                        disabled={requestLoading}
                    >

                        {requestLoading
                            ? "Submitting..."
                            : "Request Enrollment"
                        }

                    </Button>

                </DialogActions>

            </Dialog>

        </DashboardLayout>

    );

};


export default StudentDashboard;