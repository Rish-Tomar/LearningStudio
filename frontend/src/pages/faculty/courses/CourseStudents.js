import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Checkbox,
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

import UploadFileIcon from "@mui/icons-material/UploadFile";

import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import courseService from "../../../services/courseService";
import enrollmentService from "../../../services/enrollmentService";


const CourseStudents = () => {

    const { courseId } = useParams();

    const navigate = useNavigate();


    const [course, setCourse] = useState(null);

    const [pendingRequests, setPendingRequests] =
        useState([]);

    const [enrolledStudents, setEnrolledStudents] =
        useState([]);


    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    /*
     * =========================================================
     * EXCEL IMPORT STATE
     * =========================================================
     */

    const [selectedFile, setSelectedFile] =
        useState(null);

    const [previewData, setPreviewData] =
        useState(null);

    const [previewLoading, setPreviewLoading] =
        useState(false);

    const [selectedStudents, setSelectedStudents] =
        useState([]);


    /*
     * =========================================================
     * FETCH COURSE DATA
     * =========================================================
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

                courseService.getCourseById(
                    courseId
                ),

                enrollmentService.getPendingEnrollments(
                    courseId
                ),

                enrollmentService.getCourseEnrollments(
                    courseId
                )

            ]);


            setCourse(
                courseResponse.data
            );

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
     * =========================================================
     * APPROVE ENROLLMENT
     * =========================================================
     */

    const handleApprove = async (
        enrollmentId
    ) => {

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
     * =========================================================
     * REJECT ENROLLMENT
     * =========================================================
     */

    const handleReject = async (
        enrollmentId
    ) => {

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
     * =========================================================
     * REMOVE STUDENT
     * =========================================================
     */

    const handleRemove = async (
        enrollmentId
    ) => {

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


    /*
     * =========================================================
     * EXCEL FILE SELECTION
     * =========================================================
     */

    const handleFileChange = (
        event
    ) => {

        const file =
            event.target.files?.[0];

        if (!file) {

            return;

        }


        setSelectedFile(file);

        setPreviewData(null);

        setSelectedStudents([]);

        setError("");

    };


    /*
     * =========================================================
     * EXCEL PREVIEW
     * =========================================================
     */

    const handlePreview = async () => {

        if (!selectedFile) {

            alert(
                "Please select an Excel file first"
            );

            return;

        }


        try {

            setPreviewLoading(true);

            setError("");

            setSelectedStudents([]);


            const response =
                await enrollmentService.previewBulkEnrollment(
                    courseId,
                    selectedFile
                );


            console.log(
                "BULK PREVIEW RESPONSE:",
                response
            );


            console.log(
                "BULK PREVIEW DATA:",
                response.data
            );


            /*
             * enrollmentService already returns
             * response.data from Axios.
             */
            setPreviewData(
                response.data
            );


        } catch (error) {

            console.error(
                "Failed to preview Excel file:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to preview Excel file"
            );


        } finally {

            setPreviewLoading(false);

        }

    };


    /*
     * =========================================================
     * READY STUDENTS
     * =========================================================
     */

    const readyStudents =
        previewData?.students?.filter(
            (student) =>
                student.status === "READY"
        ) || [];


    /*
     * =========================================================
     * SELECT / UNSELECT STUDENT
     * =========================================================
     */

    const handleStudentSelection = (
        studentId
    ) => {

        setSelectedStudents(
            (previous) => {

                if (
                    previous.includes(
                        studentId
                    )
                ) {

                    return previous.filter(
                        (id) =>
                            id !== studentId
                    );

                }


                return [
                    ...previous,
                    studentId
                ];

            }
        );

    };


    /*
     * =========================================================
     * SELECT ALL READY STUDENTS
     * =========================================================
     */

    const handleSelectAllReady = () => {

        if (
            selectedStudents.length ===
            readyStudents.length
        ) {

            setSelectedStudents([]);

            return;

        }


        setSelectedStudents(
            readyStudents.map(
                (student) =>
                    student.studentId
            )
        );

    };


    /*
     * =========================================================
     * ENROLL SELECTED STUDENTS
     * =========================================================
     *
     * This button is intentionally not connected
     * to the backend yet.
     */

    const handleBulkEnrollment = () => {

        console.log(
            "Selected students:",
            selectedStudents
        );

        alert(
            `${selectedStudents.length} student(s) selected`
        );

    };


    /*
     * =========================================================
     * LOADING STATE
     * =========================================================
     */

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


    /*
     * =========================================================
     * ERROR STATE
     * =========================================================
     */

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


    /*
     * =========================================================
     * MAIN UI
     * =========================================================
     */

    return (

        <DashboardLayout>

            <Box>


                {/* =================================================
                    HEADER
                ================================================= */}

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
                            sx={{
                                mt: 0.5
                            }}
                        >
                            {course?.name}
                            {" "}
                            ({course?.code})
                        </Typography>

                    </Box>


                    <Box
                        sx={{
                            display: "flex",
                            gap: 1
                        }}
                    >

                        <Button
                            variant="contained"
                            component="label"
                            startIcon={
                                <UploadFileIcon />
                            }
                        >
                            Import Students

                            <input
                                type="file"
                                hidden
                                accept=".xlsx,.xls"
                                onChange={
                                    handleFileChange
                                }
                            />

                        </Button>


                        <Button
                            variant="outlined"
                            onClick={() =>
                                navigate(
                                    "/faculty/courses"
                                )
                            }
                        >
                            Back to Courses
                        </Button>

                    </Box>

                </Box>


                {/* =================================================
                    SELECTED EXCEL FILE
                ================================================= */}

                {selectedFile && (

                    <Paper
                        elevation={1}
                        sx={{
                            p: 2,
                            mb: 4
                        }}
                    >

                        <Typography
                            variant="body1"
                            fontWeight={500}
                        >
                            Selected Excel File
                        </Typography>


                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 0.5,
                                mb: 2
                            }}
                        >
                            {selectedFile.name}
                        </Typography>


                        <Button
                            variant="contained"
                            onClick={
                                handlePreview
                            }
                            disabled={
                                previewLoading
                            }
                        >

                            {previewLoading
                                ? "Validating..."
                                : "Preview Students"}

                        </Button>

                    </Paper>

                )}


                {/* =================================================
                    EXCEL PREVIEW
                ================================================= */}

                {previewData && (

                    <Box
                        sx={{
                            mb: 5
                        }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{
                                mb: 2
                            }}
                        >
                            Preview Students
                        </Typography>


                        {/* =================================================
                            SUMMARY
                        ================================================= */}

                        <Paper
                            elevation={1}
                            sx={{
                                p: 2,
                                mb: 2
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 3,
                                    flexWrap: "wrap"
                                }}
                            >

                                <Typography>
                                    Total:{" "}
                                    <strong>
                                        {previewData.summary?.total || 0}
                                    </strong>
                                </Typography>

                                <Typography color="success.main">
                                    Ready:{" "}
                                    <strong>
                                        {previewData.summary?.ready || 0}
                                    </strong>
                                </Typography>

                                <Typography color="warning.main">
                                    Skipped:{" "}
                                    <strong>
                                        {previewData.summary?.skipped || 0}
                                    </strong>
                                </Typography>

                                <Typography color="error.main">
                                    Failed:{" "}
                                    <strong>
                                        {previewData.summary?.failed || 0}
                                    </strong>
                                </Typography>

                            </Box>

                        </Paper>


                        {/* =================================================
                            SELECTION BAR
                        ================================================= */}

                        <Paper
                            elevation={1}
                            sx={{
                                p: 2,
                                mb: 2
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >

                                <Typography>

                                    {selectedStudents.length}{" "}
                                    student
                                    {selectedStudents.length !== 1
                                        ? "s"
                                        : ""}{" "}
                                    selected

                                </Typography>


                                <Button
                                    variant="contained"
                                    disabled={
                                        selectedStudents.length === 0
                                    }
                                    onClick={
                                        handleBulkEnrollment
                                    }
                                >
                                    Enroll Selected Students
                                </Button>

                            </Box>

                        </Paper>


                        {/* =================================================
                            PREVIEW TABLE
                        ================================================= */}

                        <TableContainer
                            component={Paper}
                            elevation={2}
                        >

                            <Table>

                                <TableHead>

                                    <TableRow>

                                        <TableCell
                                            padding="checkbox"
                                        >

                                            <Checkbox
                                                checked={
                                                    readyStudents.length > 0 &&
                                                    selectedStudents.length ===
                                                        readyStudents.length
                                                }
                                                indeterminate={
                                                    selectedStudents.length > 0 &&
                                                    selectedStudents.length <
                                                        readyStudents.length
                                                }
                                                onChange={
                                                    handleSelectAllReady
                                                }
                                                disabled={
                                                    readyStudents.length === 0
                                                }
                                            />

                                        </TableCell>


                                        <TableCell>
                                            <strong>
                                                Name
                                            </strong>
                                        </TableCell>


                                        <TableCell>
                                            <strong>
                                                Email
                                            </strong>
                                        </TableCell>


                                        <TableCell>
                                            <strong>
                                                Status
                                            </strong>
                                        </TableCell>


                                        <TableCell>
                                            <strong>
                                                Message
                                            </strong>
                                        </TableCell>

                                    </TableRow>

                                </TableHead>


                                <TableBody>

                                    {(
                                        previewData.students ||
                                        []
                                    ).map(
                                        (
                                            student,
                                            index
                                        ) => (

                                            <TableRow
                                                key={
                                                    student.studentId ||
                                                    student.email ||
                                                    index
                                                }
                                                hover
                                            >

                                                <TableCell
                                                    padding="checkbox"
                                                >

                                                    <Checkbox
                                                        checked={
                                                            student.status ===
                                                                "READY" &&
                                                            selectedStudents.includes(
                                                                student.studentId
                                                            )
                                                        }
                                                        disabled={
                                                            student.status !==
                                                            "READY"
                                                        }
                                                        onChange={() =>
                                                            handleStudentSelection(
                                                                student.studentId
                                                            )
                                                        }
                                                    />

                                                </TableCell>


                                                <TableCell>
                                                    {
                                                        student.name ||
                                                        "-"
                                                    }
                                                </TableCell>


                                                <TableCell>
                                                    {
                                                        student.email ||
                                                        "-"
                                                    }
                                                </TableCell>


                                                <TableCell>

                                                    <Chip
                                                        label={
                                                            student.status ||
                                                            "-"
                                                        }
                                                        color={
                                                            student.status ===
                                                            "READY"
                                                                ? "success"
                                                                : student.status ===
                                                                  "SKIPPED"
                                                                ? "warning"
                                                                : "error"
                                                        }
                                                        size="small"
                                                    />

                                                </TableCell>


                                                <TableCell>
                                                    {
                                                        student.reason ||
                                                        "-"
                                                    }
                                                </TableCell>

                                            </TableRow>

                                        )
                                    )}

                                </TableBody>

                            </Table>

                        </TableContainer>


                        {(
                            !previewData.students ||
                            previewData.students.length === 0
                        ) && (

                            <Paper
                                elevation={1}
                                sx={{
                                    p: 3,
                                    mt: 2
                                }}
                            >

                                <Typography
                                    color="text.secondary"
                                >
                                    No students were found
                                    in the uploaded Excel
                                    file.
                                </Typography>

                            </Paper>

                        )}

                    </Box>

                )}


                {/* =================================================
                    PENDING ENROLLMENT REQUESTS
                ================================================= */}

                <Box
                    sx={{
                        mb: 5
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2
                        }}
                    >
                        Pending Enrollment Requests
                    </Typography>


                    {pendingRequests.length === 0 ? (

                        <Paper
                            elevation={1}
                            sx={{
                                p: 3
                            }}
                        >

                            <Typography
                                color="text.secondary"
                            >
                                No pending enrollment
                                requests.
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
                                            <strong>
                                                Student
                                            </strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>
                                                Email
                                            </strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>
                                                Requested At
                                            </strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>
                                                Method
                                            </strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>
                                                Actions
                                            </strong>
                                        </TableCell>

                                    </TableRow>

                                </TableHead>


                                <TableBody>

                                    {pendingRequests.map(
                                        (
                                            enrollment
                                        ) => (

                                            <TableRow
                                                key={
                                                    enrollment._id
                                                }
                                                hover
                                            >

                                                <TableCell>
                                                    {
                                                        enrollment
                                                            .student
                                                            ?.name ||
                                                        "-"
                                                    }
                                                </TableCell>


                                                <TableCell>
                                                    {
                                                        enrollment
                                                            .student
                                                            ?.email ||
                                                        "-"
                                                    }
                                                </TableCell>


                                                <TableCell>
                                                    {
                                                        enrollment.requestedAt
                                                            ? new Date(
                                                                enrollment.requestedAt
                                                            ).toLocaleString()
                                                            : "-"
                                                    }
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


                {/* =================================================
                    ENROLLED STUDENTS
                ================================================= */}

                <Box>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mb: 2
                        }}
                    >
                        Enrolled Students
                    </Typography>


                    {enrolledStudents.length === 0 ? (

                        <Paper
                            elevation={1}
                            sx={{
                                p: 3
                            }}
                        >

                            <Typography
                                color="text.secondary"
                            >
                                No students are currently
                                enrolled.
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
                                            <strong>
                                                Student
                                            </strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>
                                                Email
                                            </strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>
                                                Enrolled At
                                            </strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>
                                                Status
                                            </strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>
                                                Actions
                                            </strong>
                                        </TableCell>

                                    </TableRow>

                                </TableHead>


                                <TableBody>

                                    {enrolledStudents.map(
                                        (
                                            enrollment
                                        ) => (

                                            <TableRow
                                                key={
                                                    enrollment._id
                                                }
                                                hover
                                            >

                                                <TableCell>
                                                    {
                                                        enrollment
                                                            .student
                                                            ?.name ||
                                                        "-"
                                                    }
                                                </TableCell>


                                                <TableCell>
                                                    {
                                                        enrollment
                                                            .student
                                                            ?.email ||
                                                        "-"
                                                    }
                                                </TableCell>


                                                <TableCell>
                                                    {
                                                        enrollment.approvedAt
                                                            ? new Date(
                                                                enrollment.approvedAt
                                                            ).toLocaleString()
                                                            : "-"
                                                    }
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