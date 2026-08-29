import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";

import { useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import courseService from "../../services/courseService";
import moduleService from "../../services/moduleService";
import topicService from "../../services/topicService";


const StudentCourseOverview = () => {

    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [topicsByModule, setTopicsByModule] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchCourseOverview = async () => {

            try {

                setLoading(true);
                setError("");


                /*
                 * =====================================================
                 * FETCH COURSE
                 * =====================================================
                 */

                const courseResponse =
                    await courseService.getCourseById(courseId);

                const courseData =
                    courseResponse.data;

                setCourse(courseData);


                /*
                 * =====================================================
                 * FETCH MODULES
                 * =====================================================
                 */

                const modulesResponse =
                    await moduleService.getModules();

                const allModules =
                    modulesResponse.data || [];

                const courseModules =
                    allModules.filter(
                        (module) =>
                            module.course?._id === courseId
                    );

                setModules(courseModules);


                /*
                 * =====================================================
                 * FETCH TOPICS FOR EACH MODULE
                 * =====================================================
                 */

                const topicResults =
                    await Promise.all(
                        courseModules.map(async (module) => {

                            const response =
                                await topicService.getTopicsByModule(
                                    module._id
                                );

                            return {
                                moduleId: module._id,
                                topics: response.data || [],
                            };

                        })
                    );


                const topicMap = {};

                topicResults.forEach(
                    ({ moduleId, topics }) => {

                        topicMap[moduleId] = topics;

                    }
                );

                setTopicsByModule(topicMap);


            } catch (error) {

                console.error(
                    "Failed to load student course overview:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load course overview"
                );

            } finally {

                setLoading(false);

            }

        };


        if (courseId) {
            fetchCourseOverview();
        }

    }, [courseId]);


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
                        alignItems: "center",
                        minHeight: "300px",
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

                <Alert severity="error">{error}</Alert>

            </DashboardLayout>

        );

    }


    /*
     * =========================================================
     * COURSE NOT FOUND
     * =========================================================
     */

    if (!course) {

        return (

            <DashboardLayout>

                <Alert severity="warning">
                    Course not found.
                </Alert>

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

                {/* Course Header */}

                <Box sx={{ mb: 4 }}>

                    <Typography variant="h4" fontWeight={600}>
                        {course.name}
                    </Typography>

                    {course.code && (
                        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
                            {course.code}
                        </Typography>
                    )}

                </Box>


                {/* Course Information */}

                <Card sx={{ mb: 4 }}>

                    <CardContent>

                        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                            Course Information
                        </Typography>

                        {course.description && (
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                {course.description}
                            </Typography>
                        )}

                        {course.faculty && (
                            <Typography variant="body2" color="text.secondary">
                                Instructor: {course.faculty.name || course.faculty.email || "Faculty"}
                            </Typography>
                        )}

                    </CardContent>

                </Card>


                {/* Course Modules */}

                <Box>

                    <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                        Course Modules
                    </Typography>


                    {modules.length === 0 ? (

                        <Alert severity="info">
                            No modules are available for this course yet.
                        </Alert>

                    ) : (

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                            {modules.map((module) => {

                                const topics =
                                    topicsByModule[module._id] || [];


                                return (

                                    <Card key={module._id}>

                                        <CardContent>

                                            <Typography variant="h6" fontWeight={600}>
                                                {module.code
                                                    ? `${module.code} - ${module.name}`
                                                    : module.name}
                                            </Typography>


                                            {module.description && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                                                    {module.description}
                                                </Typography>
                                            )}


                                            <Divider sx={{ my: 1 }} />


                                            <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                                Topics
                                            </Typography>


                                            {topics.length === 0 ? (

                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    No topics available in this module yet.
                                                </Typography>

                                            ) : (

                                                <List disablePadding sx={{ mt: 1 }}>

                                                    {topics.map((topic) => (

                                                        <ListItem key={topic._id} disablePadding>

                                                            <ListItemButton
                                                                onClick={() =>
                                                                navigate(`/student/topics/${topic._id}`)
                                                            }>

                                                                <ListItemText
                                                                    primary={topic.name}
                                                                    secondary={topic.code}
                                                                />

                                                            </ListItemButton>

                                                        </ListItem>

                                                    ))}

                                                </List>

                                            )}

                                        </CardContent>

                                    </Card>

                                );

                            })}

                        </Box>

                    )}

                </Box>

            </Box>

        </DashboardLayout>

    );

};


export default StudentCourseOverview;