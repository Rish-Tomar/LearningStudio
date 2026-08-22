import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import FacultyDashboard from "../pages/faculty/FacultyDashboard";
import StudentDashboard from "../pages/student/StudentDashBoard.js";
// import AdminDashboard from "../pages/admin/AdminDashboard";
import PublicRoute from "./PublicRoute.js";
import ProtectedRoute from "./ProtectedRoute.js";
import TopicList from "../pages/faculty/topics/TopicList";
import CreateTopic from "../pages/faculty/topics/CreateTopic";
import EditTopic from "../pages/faculty/topics/EditTopic";
import QuestionList from "../pages/faculty/questions/QuestionList.js";
import QuestionDetails from "../pages/faculty/questions/QuestionDetails";
import CreateQuestion from "../pages/faculty/questions/CreateQuestion";
import CourseList from "../pages/faculty/courses/CourseList.js";
import CreateModule from "../components/modules/CreateModule.js";
import ModuleList from "../pages/faculty/modules/ModuleList.js";
import ModuleTopicList from "../pages/faculty/modules/ModuleTopicList.js";
import CreateModuleTopic from "../pages/faculty/modules/CreateModuleTopic.js";
import TopicQuestionList from "../pages/faculty/topics/TopicQuestionList.js";
import TopicLearningStudio from "../pages/faculty/learningStudio/TopicLearningStudio.js";
import CreateLearningContent from "../pages/faculty/learningStudio/CreateLearningContent.js";
import EditLearningContent from "../pages/faculty/learningStudio/EditLearningContent.js";
import EditLearningActivity from "../pages/faculty/learningStudio/EditLearningActivity.js";
import CreateLearningActivity from "../pages/faculty/learningStudio/CreateLearningContent.js";
import CourseStudents from "../pages/faculty/courses/CourseStudents.js";
const AppRoutes = () => {

    return (

        <Routes>

            <Route path="/" element={ <PublicRoute>
                                            <Login />
                                      </PublicRoute>
                                    }
            />

            <Route
                path="/register"
                element={
                    <PublicRoute> <Register /> </PublicRoute>
                }
            />

            <Route
                path="/faculty"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <FacultyDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/topics"
                element={
                    <ProtectedRoute roles={["FACULTY"]} >
                        <TopicList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/questions"
                element={
                    <ProtectedRoute roles={["FACULTY"]} >
                        <QuestionList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/topics/create"
                element={
                    <ProtectedRoute roles={["FACULTY"]} >
                        <CreateTopic />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/faculty/topics/:topicId/learning-studio/content/:contentId/edit"
                element={<EditLearningContent />}
            />

            <Route
                path="/faculty/topics/:topicId/questions"
                element={
                    <ProtectedRoute
                        roles={["FACULTY"]}
                    >
                        <TopicQuestionList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/topics/:topicId/learning-studio/activity/:activityId/edit"
                element={
                    <ProtectedRoute
                        roles={["FACULTY"]}
                    >
                        <EditLearningActivity />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/faculty/topics/:topicId/learning-studio/activity/create"
                element={
                    <ProtectedRoute
                        roles={["FACULTY"]}
                    >
                        <CreateLearningActivity />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/questions/:id"
                element={
                    <ProtectedRoute roles={["FACULTY"]} >
                        <QuestionDetails />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/topics/:id/edit"
                element={
                    <ProtectedRoute roles={["FACULTY"]} >
                        <EditTopic />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/faculty/topics/:topicId/learning-studio"
                element={
                    <ProtectedRoute
                        roles={["FACULTY"]}
                    >
                        <TopicLearningStudio />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/topics/:topicId/learning-studio/content/create"
                element={
                    <ProtectedRoute
                        roles={["FACULTY"]}
                    >
                        <CreateLearningContent />
                    </ProtectedRoute>
                }
            />
            

            <Route
                path="/faculty/questions/create"
                element={
                    <ProtectedRoute
                        roles={["FACULTY"]}
                    >
                        <CreateQuestion />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/courses"
                element={
                    <ProtectedRoute
                        roles={["FACULTY"]}
                    >
                        <CourseList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/courses/:courseId/modules"
                element={
                    <ProtectedRoute roles={["FACULTY"]} >
                        <ModuleList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/courses/:courseId/modules/create"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <CreateModule />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/faculty/courses/:courseId/students"
                element={<CourseStudents />}
            />
            <Route
                path="/faculty/modules/:moduleId/topics"
                element={
                    <ProtectedRoute roles={["FACULTY"]} >
                        <ModuleTopicList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/modules/:moduleId/topics/create"
                element={
                    <ProtectedRoute roles={["FACULTY"]}>
                        <CreateModuleTopic />
                    </ProtectedRoute>
                }
            />

           <Route
                path="/student"
                element={
                    <ProtectedRoute roles={["STUDENT"]}>
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />

            {/* <Route
                path="/admin"
                element={
                    <ProtectedRoute
                        roles={["ADMIN"]}
                    >
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            /> */}

        </Routes>

    );

};

export default AppRoutes;