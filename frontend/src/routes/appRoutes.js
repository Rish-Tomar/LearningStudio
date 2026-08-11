import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import FacultyDashboard from "../pages/faculty/FacultyDashboard";
import StudentDashboard from "../pages/student/StudentDashBoard.js";
// import AdminDashboard from "../pages/admin/AdminDashboard";
import PublicRoute from "./PublicRoute.js";
import ProtectedRoute from "./ProtectedRoute.js";
import TopicList from "../pages/faculty/topics/TopicList";

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