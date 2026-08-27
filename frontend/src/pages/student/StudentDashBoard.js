import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  CircularProgress,
  Grid,
  Chip,
  Tabs,
  Tab,
  Paper,
  Avatar
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import ClassIcon from "@mui/icons-material/Class";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import courseService from "../../services/courseService";
import enrollmentService from "../../services/enrollmentService";

const StudentDashboard = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const studentName = auth?.user?.name || "Student";

  const [activeTab, setActiveTab] = useState(0);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState("");

  const [myEnrollments, setMyEnrollments] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  const [enrollmentsError, setEnrollmentsError] = useState("");

  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [classroomCode, setClassroomCode] = useState("");

  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");

  const fetchStudentData = async () => {
    try {
      setEnrollmentsLoading(true);
      setEnrollmentsError("");

      const [enrollmentsRes, requestsRes] = await Promise.all([
        enrollmentService.getMyEnrollments(),
        enrollmentService.getMyEnrollmentRequests()
      ]);

      setMyEnrollments(enrollmentsRes.data || []);
      setMyRequests(requestsRes.data || []);
    } catch (error) {
      console.error("Failed to fetch student data:", error);
      setEnrollmentsError(
        error.response?.data?.message || "Failed to load dashboard data"
      );
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        setCoursesError("");
        const response = await courseService.getCourses();
        setCourses(response.data || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setCoursesError(
          error.response?.data?.message || "Failed to load course list"
        );
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
    fetchStudentData();
  }, []);

  const handleOpenJoinDialog = () => {
    setSelectedCourse("");
    setClassroomCode("");
    setRequestError("");
    setRequestSuccess("");
    setJoinDialogOpen(true);
  };

  const handleCloseJoinDialog = () => {
    if (requestLoading) return;
    setJoinDialogOpen(false);
    setSelectedCourse("");
    setClassroomCode("");
    setRequestError("");
    setRequestSuccess("");
  };

  const handleEnrollmentRequest = async () => {
    setRequestError("");
    setRequestSuccess("");

    if (!selectedCourse && !classroomCode.trim()) {
      setRequestError("Please select a course or enter a classroom code.");
      return;
    }

    try {
      setRequestLoading(true);
      if (selectedCourse) {
        await enrollmentService.requestEnrollmentByCourse(selectedCourse);
      } else if (classroomCode.trim()) {
        await enrollmentService.requestEnrollmentByClassroomCode(classroomCode.trim());
      }

      setRequestSuccess("Enrollment request submitted! Waiting for faculty approval.");
      setSelectedCourse("");
      setClassroomCode("");
      await fetchStudentData();
      
      setTimeout(() => {
        handleCloseJoinDialog();
      }, 1500);
    } catch (error) {
      console.error("Enrollment request failed:", error);
      setRequestError(
        error.response?.data?.message || "Failed to submit enrollment request"
      );
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Welcome back, {studentName}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Track your courses, complete assignments, and level up your skills.
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleOpenJoinDialog}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 3 }}
        >
          Join New Course
        </Button>
      </Box>

      {/* Overview Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "primary.light", color: "primary.main", width: 48, height: 48 }}>
                <ClassIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {myEnrollments.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enrolled Courses
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "warning.light", color: "warning.dark", width: 48, height: 48 }}>
                <HourglassTopIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {myRequests.filter(r => r.status === "PENDING").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Approvals
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "success.light", color: "success.dark", width: 48, height: 48 }}>
                <SchoolIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Active
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Academic Status
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Navigation Tabs */}
      <Box sx={{ width: "100%", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label={`Active Courses (${myEnrollments.length})`} sx={{ fontWeight: 600, textTransform: "none" }} />
          <Tab label={`Pending Requests (${myRequests.length})`} sx={{ fontWeight: 600, textTransform: "none" }} />
        </Tabs>
      </Box>

      {/* Tab 0: Active Enrolled Courses */}
      {activeTab === 0 && (
        <Box>
          {enrollmentsLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {!enrollmentsLoading && enrollmentsError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {enrollmentsError}
            </Alert>
          )}

          {!enrollmentsLoading && !enrollmentsError && myEnrollments.length === 0 && (
            <Card sx={{ p: 6, textAlign: "center", borderRadius: 3, border: "1px dashed", borderColor: "divider" }}>
              <SchoolIcon sx={{ fontSize: 56, color: "text.secondary", mb: 1.5 }} />
              <Typography variant="h6" fontWeight={600}>
                No Enrolled Courses
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3, maxWidth: 400, mx: "auto" }}>
                You are not currently active in any courses. Explore available subjects or enter a code to request access.
              </Typography>
              <Button variant="contained" onClick={handleOpenJoinDialog}>
                Join Your First Course
              </Button>
            </Card>
          )}

          {!enrollmentsLoading && !enrollmentsError && myEnrollments.length > 0 && (
            <Grid container spacing={3}>
              {myEnrollments.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "0.2s hover",
                      "&:hover": { boxShadow: 4, transform: "translateY(-2px)" }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Chip
                          label={item.course?.code || "COURSE"}
                          color="primary"
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                        <Chip label="Active" color="success" size="small" variant="outlined" />
                      </Box>

                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {item.course?.name || "Untitled Course"}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          WebkitLineClamp: 2,
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {item.course?.description || "No description provided for this course."}
                      </Typography>

                      <Divider sx={{ my: 1.5 }} />

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                        <PersonIcon fontSize="small" />
                        <Typography variant="caption" fontWeight={500}>
                          Instructor: {item.course?.createdBy?.name || "Faculty"}
                        </Typography>
                      </Box>
                    </CardContent>

                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate(`/student/courses/${item.course?._id}`)}
                        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                      >
                        Go to Course
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Tab 1: Pending Requests */}
      {activeTab === 1 && (
        <Box>
          {myRequests.length === 0 ? (
            <Card sx={{ p: 5, textAlign: "center", borderRadius: 3, border: "1px dashed", borderColor: "divider" }}>
              <Typography variant="body1" color="text.secondary">
                No active course requests found.
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {myRequests.map((req) => (
                <Grid item xs={12} key={req._id}>
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {req.course?.name || "Requested Course"} ({req.course?.code || "N/A"})
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Requested on: {new Date(req.createdAt || Date.now()).toLocaleDateString()} • Method: {req.enrollmentMethod}
                      </Typography>
                    </Box>
                    <Chip
                      label={req.status}
                      color={req.status === "APPROVED" ? "success" : req.status === "REJECTED" ? "error" : "warning"}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Dialog for Joining Course */}
      <Dialog open={joinDialogOpen} onClose={handleCloseJoinDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Join a Course</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select a course from the list or submit a classroom code provided by your teacher.
          </Typography>

          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            Option 1: Select Course
          </Typography>
          <TextField
            select
            fullWidth
            label="Available Courses"
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setClassroomCode("");
              setRequestError("");
            }}
            disabled={coursesLoading || requestLoading}
          >
            <MenuItem value="">Select a course</MenuItem>
            {courses.map((course) => (
              <MenuItem key={course._id} value={course._id}>
                {course.name} ({course.code})
              </MenuItem>
            ))}
          </TextField>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            Option 2: Classroom Code
          </Typography>
          <TextField
            fullWidth
            label="Classroom Code (e.g. CS101-2026)"
            value={classroomCode}
            onChange={(e) => {
              setClassroomCode(e.target.value);
              setSelectedCourse("");
              setRequestError("");
            }}
            disabled={requestLoading}
          />

          {requestError && <Alert severity="error" sx={{ mt: 3 }}>{requestError}</Alert>}
          {requestSuccess && <Alert severity="success" sx={{ mt: 3 }}>{requestSuccess}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseJoinDialog} disabled={requestLoading}>Cancel</Button>
          <Button variant="contained" onClick={handleEnrollmentRequest} disabled={requestLoading}>
            {requestLoading ? <CircularProgress size={20} /> : "Submit Request"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default StudentDashboard;