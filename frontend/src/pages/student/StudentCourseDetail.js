import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Breadcrumbs,
  Link
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AnnouncementIcon from "@mui/icons-material/Campaign";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import DashboardLayout from "../../layouts/DashboardLayout";
import courseService from "../../services/courseService";

const StudentCourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [course, setCourse] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Submission Modal State
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch course details, announcements, materials, and assignments
        const response = await courseService.getCourseById(courseId);
        setCourse(response.data.course);
        setAnnouncements(response.data.announcements || []);
        setMaterials(response.data.materials || []);
        setAssignments(response.data.assignments || []);
      } catch (err) {
        console.error("Failed to load course details:", err);
        setError(err.response?.data?.message || "Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const handleOpenSubmission = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionUrl("");
    setSubmitSuccess("");
    setSubmissionOpen(true);
  };

  const handleCloseSubmission = () => {
    if (submitting) return;
    setSubmissionOpen(false);
    setSelectedAssignment(null);
  };

  const handleSubmitAssignment = async () => {
    if (!submissionUrl.trim()) return;

    try {
      setSubmitting(true);
      // Call assignment submission API service endpoint
      await courseService.submitAssignment(selectedAssignment._id, { submissionUrl });
      
      setSubmitSuccess("Assignment submitted successfully!");
      setTimeout(() => {
        handleCloseSubmission();
      }, 1500);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Course not found."}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/student/dashboard")}>
          Back to Dashboard
        </Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate("/student/dashboard")} sx={{ cursor: "pointer" }}>
          Dashboard
        </Link>
        <Typography color="text.primary">{course.code}</Typography>
      </Breadcrumbs>

      {/* Header Banner */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, bgcolor: "primary.main", color: "primary.contrastText" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Chip label={course.code} sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "#fff", fontWeight: 700, mb: 1 }} />
            <Typography variant="h3" fontWeight={700}>
              {course.name}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9, maxWidth: 650 }}>
              {course.description}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/student/dashboard")}
            sx={{ color: "#fff", borderColor: "rgba(255, 255, 255, 0.5)", "&:hover": { borderColor: "#fff", bgcolor: "rgba(255, 255, 255, 0.1)" } }}
          >
            Back
          </Button>
        </Box>
      </Paper>

      {/* Course Content Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
          <Tab icon={<AnnouncementIcon />} iconPosition="start" label={`Announcements (${announcements.length})`} sx={{ textTransform: "none", fontWeight: 600 }} />
          <Tab icon={<AssignmentIcon />} iconPosition="start" label={`Assignments (${assignments.length})`} sx={{ textTransform: "none", fontWeight: 600 }} />
          <Tab icon={<FolderIcon />} iconPosition="start" label={`Materials (${materials.length})`} sx={{ textTransform: "none", fontWeight: 600 }} />
        </Tabs>
      </Box>

      {/* Tab 0: Announcements */}
      {activeTab === 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {announcements.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center", color: "text.secondary", borderRadius: 2 }}>
              No announcements posted for this course yet.
            </Paper>
          ) : (
            announcements.map((item) => (
              <Card key={item._id} elevation={0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="h6" fontWeight={600}>{item.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ whitespace: "pre-line" }}>
                    {item.content}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}

      {/* Tab 1: Assignments */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {assignments.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: "center", color: "text.secondary", borderRadius: 2 }}>
                No assignments assigned yet.
              </Paper>
            </Grid>
          ) : (
            assignments.map((assignment) => (
              <Grid item xs={12} md={6} key={assignment._id}>
                <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", p: 1 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {assignment.title}
                      </Typography>
                      {assignment.submitted ? (
                        <Chip icon={<CheckCircleIcon />} label="Submitted" color="success" size="small" />
                      ) : (
                        <Chip label="Pending" color="warning" size="small" variant="outlined" />
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {assignment.description}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography variant="caption" color="error" fontWeight={600} display="block">
                      Due Date: {new Date(assignment.dueDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<UploadFileIcon />}
                      onClick={() => handleOpenSubmission(assignment)}
                    >
                      {assignment.submitted ? "Resubmit Work" : "Submit Assignment"}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Tab 2: Materials & Files */}
      {activeTab === 2 && (
        <Paper elevation={0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
          {materials.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 4, textAlign: "center" }}>
              No course resources or reading materials uploaded.
            </Typography>
          ) : (
            <List>
              {materials.map((file, idx) => (
                <ListItem
                  key={file._id || idx}
                  divider={idx !== materials.length - 1}
                  secondaryAction={
                    <Button variant="outlined" size="small" href={file.fileUrl} target="_blank">
                      Download
                    </Button>
                  }
                >
                  <ListItemIcon>
                    <InsertDriveFileIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={file.title} secondary={`Uploaded on ${new Date(file.createdAt).toLocaleDateString()}`} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}

      {/* Assignment Submission Dialog */}
      <Dialog open={submissionOpen} onClose={handleCloseSubmission} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Submit Work</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Provide the link to your project work or file submission for: <strong>{selectedAssignment?.title}</strong>
          </Typography>
          <TextField
            fullWidth
            label="Submission URL (GitHub / Google Drive / Live URL)"
            value={submissionUrl}
            onChange={(e) => setSubmissionUrl(e.target.value)}
            disabled={submitting}
          />
          {submitSuccess && <Alert severity="success" sx={{ mt: 2 }}>{submitSuccess}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseSubmission} disabled={submitting}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitAssignment} disabled={submitting || !submissionUrl.trim()}>
            {submitting ? <CircularProgress size={20} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default StudentCourseDetail;