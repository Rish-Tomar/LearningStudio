import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import FacultyDashboard from "../pages/faculty/FacultyDashboard";
import StudentDashboard from "../pages/student/StudentDashBoard.js";
// import AdminDashboard from "../pages/admin/AdminDashboard";

const AppRoutes = () => {

    return (

        <Routes>

            <Route path="/" element={<Login />} />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/faculty"
                element={<FacultyDashboard />}
            />

            <Route
                path="/student"
                element={<StudentDashboard />}
            />

            {/* <Route
                path="/admin"
                element={<AdminDashboard />}
            /> */}

        </Routes>

    );

};

export default AppRoutes;