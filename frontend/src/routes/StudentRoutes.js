import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import StudentDashboard from "../pages/student/StudentDashBoard";
import StudentCourses from "../pages/student/StudentCourses";
import StudentCourseOverview from "../pages/student/StudentCourseOverview";
import StudentTopicLearning from "../pages/student/StudentTopicLearning";
import StudentJoinQuiz from "../pages/student/StudentJoinQuiz";
import QuizRunner from "../pages/student/QuizRunner";
import QuizResult from "../pages/student/QuizResult";

const StudentRoutes = () => {

    return (

        <Routes>

            <Route
                path="/"
                element={
                    <ProtectedRoute roles={["STUDENT"]}>
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/courses"
                element={
                    <ProtectedRoute roles={["STUDENT"]}>
                        <StudentCourses />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/courses/:courseId"
                element={
                    <ProtectedRoute roles={["STUDENT"]}>
                        <StudentCourseOverview />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/topics/:topicId"
                element={
                    <ProtectedRoute roles={["STUDENT"]}>
                        <StudentTopicLearning />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/quiz/join"
                element={
                    <ProtectedRoute roles={["STUDENT"]}>
                        <StudentJoinQuiz />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/quiz/:sessionId"
                element={
                    <ProtectedRoute roles={["STUDENT"]}>
                        <QuizRunner />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/quiz/:sessionId/result"
                element={
                    <ProtectedRoute roles={["STUDENT"]}>
                        <QuizResult />
                    </ProtectedRoute>
                }
            />

        </Routes>

    );

};

export default StudentRoutes;