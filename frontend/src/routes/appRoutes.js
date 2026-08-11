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
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />

            <Route
                path="/faculty"
                element={
                    <ProtectedRoute
                        roles={["FACULTY"]}
                    >
                        <FacultyDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/topics"
                element={
                    <ProtectedRoute
                        roles={["FACULTY"]}
                    >
                        <TopicList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/questions"
                element={
                    <ProtectedRoute
                        roles={["FACULTY"]}
                    >
                        <QuestionList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/topics/create"
                element={
                    <ProtectedRoute
                        roles={["FACULTY"]}
                    >
                        <CreateTopic />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/questions/:id"
                element={
                    <ProtectedRoute
                        roles={["FACULTY"]}
                    >
                        <QuestionDetails />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/topics/:id/edit"
                element={
                    <ProtectedRoute
                        roles={["FACULTY"]}
                    >
                        <EditTopic />
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
                path="/student"
                element={
                    <ProtectedRoute
                        roles={["STUDENT"]}
                    >
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