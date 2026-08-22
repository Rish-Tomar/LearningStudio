import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import courseService from "../../../services/courseService";
import enrollmentService from "../../../services/enrollmentService";


const CourseStudents = () => {

    const { courseId } = useParams();

    const navigate = useNavigate();


    const [course, setCourse] = useState(null);

    const [pendingRequests, setPendingRequests] = useState([]);

    const [enrolledStudents, setEnrolledStudents] = useState([]);


    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] = useState(false);

    const [error, setError] = useState("");


    /*
     * Fetch course information,
     * pending requests and active students.
     */
    const fetchData = async () => {

        try {

            setLoading(true);

            setError("");


            const [
                courseResponse,
                pendingResponse,
                enrolledResponse
            ] = await Promise.all([

                courseService.getCourseById(courseId),

                enrollmentService.getPendingEnrollments(
                    courseId
                ),

                enrollmentService.getCourseEnrollments(
                    courseId
                )

            ]);


            setCourse(courseResponse.data);

            setPendingRequests(
                pendingResponse.data || []
            );

            setEnrolledStudents(
                enrolledResponse.data || []
            );


        } catch (error) {

            console.error(
                "Failed to load course students:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load student information"
            );


        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        if (courseId) {

            fetchData();

        }

    }, [courseId]);


    /*
     * Approve enrollment request.
     */
    const handleApprove = async (enrollmentId) => {

        try {

            setActionLoading(true);

            await enrollmentService.approveEnrollment(
                enrollmentId
            );

            await fetchData();

        } catch (error) {

            console.error(
                "Failed to approve enrollment:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to approve enrollment"
            );

        } finally {

            setActionLoading(false);

        }

    };


    /*
     * Reject enrollment request.
     */
    const handleReject = async (enrollmentId) => {

        try {

            setActionLoading(true);

            await enrollmentService.rejectEnrollment(
                enrollmentId
            );

            await fetchData();

        } catch (error) {

            console.error(
                "Failed to reject enrollment:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to reject enrollment"
            );

        } finally {

            setActionLoading(false);

        }

    };


    /*
     * Remove active student.
     */
    const handleRemove = async (enrollmentId) => {

        try {

            setActionLoading(true);

            await enrollmentService.removeEnrollment(
                enrollmentId
            );

            await fetchData();

        } catch (error) {

            console.error(
                "Failed to remove student:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to remove student"
            );

        } finally {

            setActionLoading(false);

        }

    };


    if (loading) {

        return (

            <DashboardLayout>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 8
                    }}
                >

                    <CircularProgress />

                </Box>

            </DashboardLayout>

        );

    }


    if (error) {

        return (

            <DashboardLayout>

                <Typography
                    color="error"
                >
                    {error}
                </Typography>

            </DashboardLayout>

        );

    }


    return (

        <DashboardLayout>

            <Box>


                {/* Header */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3
                    }}
                >

                    <Box>

                        <Typography
                            variant="h4"
                            fontWeight={600}
                        >
                            Manage Students
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            {course?.name}
                            {" "}
                            ({course?.code})
                        </Typography>

                    </Box>


                    <Button
                        variant="outlined"
                        onClick={() =>
                            navigate("/faculty/courses")
                        }
                    >
                        Back to Courses
                    </Button>

                </Box>


                {/* Pending Requests */}

                <Box sx={{ mb: 5 }}>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                    >
                        Pending Enrollment Requests
                    </Typography>


                    {pendingRequests.length === 0 ? (

                        <Paper
                            elevation={1}
                            sx={{ p: 3 }}
                        >

                            <Typography
                                color="text.secondary"
                            >
                                No pending enrollment requests.
                            </Typography>

                        </Paper>

                    ) : (

                        <TableContainer
                            component={Paper}
                            elevation={2}
                        >

                            <Table>

                                <TableHead>

                                    <TableRow>

                                        <TableCell>
                                            <strong>Student</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Email</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Requested At</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Method</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Actions</strong>
                                        </TableCell>

                                    </TableRow>

                                </TableHead>


                                <TableBody>

                                    {pendingRequests.map(
                                        (enrollment) => (

                                            <TableRow
                                                key={
                                                    enrollment._id
                                                }
                                                hover
                                            >

                                                <TableCell>

                                                    {enrollment.student?.name ||
                                                        "-"}

                                                </TableCell>


                                                <TableCell>

                                                    {enrollment.student?.email ||
                                                        "-"}

                                                </TableCell>


                                                <TableCell>

                                                    {enrollment.requestedAt
                                                        ? new Date(
                                                            enrollment.requestedAt
                                                        ).toLocaleString()
                                                        : "-"}

                                                </TableCell>


                                                <TableCell>

                                                    <Chip
                                                        label={
                                                            enrollment.enrollmentMethod ||
                                                            "-"
                                                        }
                                                        size="small"
                                                    />

                                                </TableCell>


                                                <TableCell>

                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="success"
                                                        disabled={
                                                            actionLoading
                                                        }
                                                        onClick={() =>
                                                            handleApprove(
                                                                enrollment._id
                                                            )
                                                        }
                                                    >
                                                        Approve
                                                    </Button>


                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        sx={{
                                                            ml: 1
                                                        }}
                                                        disabled={
                                                            actionLoading
                                                        }
                                                        onClick={() =>
                                                            handleReject(
                                                                enrollment._id
                                                            )
                                                        }
                                                    >
                                                        Reject
                                                    </Button>

                                                </TableCell>

                                            </TableRow>

                                        )
                                    )}

                                </TableBody>

                            </Table>

                        </TableContainer>

                    )}

                </Box>


                {/* Enrolled Students */}

                <Box>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                    >
                        Enrolled Students
                    </Typography>


                    {enrolledStudents.length === 0 ? (

                        <Paper
                            elevation={1}
                            sx={{ p: 3 }}
                        >

                            <Typography
                                color="text.secondary"
                            >
                                No students are currently enrolled.
                            </Typography>

                        </Paper>

                    ) : (

                        <TableContainer
                            component={Paper}
                            elevation={2}
                        >

                            <Table>

                                <TableHead>

                                    <TableRow>

                                        <TableCell>
                                            <strong>Student</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Email</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Enrolled At</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Status</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Actions</strong>
                                        </TableCell>

                                    </TableRow>

                                </TableHead>


                                <TableBody>

                                    {enrolledStudents.map(
                                        (enrollment) => (

                                            <TableRow
                                                key={
                                                    enrollment._id
                                                }
                                                hover
                                            >

                                                <TableCell>

                                                    {enrollment.student?.name ||
                                                        "-"}

                                                </TableCell>


                                                <TableCell>

                                                    {enrollment.student?.email ||
                                                        "-"}

                                                </TableCell>


                                                <TableCell>

                                                    {enrollment.approvedAt
                                                        ? new Date(
                                                            enrollment.approvedAt
                                                        ).toLocaleString()
                                                        : "-"}

                                                </TableCell>


                                                <TableCell>

                                                    <Chip
                                                        label={
                                                            enrollment.status
                                                        }
                                                        color="success"
                                                        size="small"
                                                    />

                                                </TableCell>


                                                <TableCell>

                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        disabled={
                                                            actionLoading
                                                        }
                                                        onClick={() =>
                                                            handleRemove(
                                                                enrollment._id
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </Button>

                                                </TableCell>

                                            </TableRow>

                                        )
                                    )}

                                </TableBody>

                            </Table>

                        </TableContainer>

                    )}

                </Box>

            </Box>

        </DashboardLayout>

    );

};


export default CourseStudents;