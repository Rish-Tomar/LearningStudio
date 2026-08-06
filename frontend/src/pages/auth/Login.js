import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
    Box,
    Typography,
    Link
} from "@mui/material";

import AuthLayout from "../../layouts/AuthLayout";

import TextField from "../../components/ui/TextField";
import PasswordField from "../../components/ui/PasswordField";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";


const Login = () => {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    //const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {
        setAuth,
        loading,
        setLoading
    } = useAuth();
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        setLoading(true);

        const response = await authService.login(formData);

        // Save authentication data
        setAuth(response.data);

        // Redirect based on role
        const role = response.data.user.role;

        switch (role) {

            case "ADMIN":
                navigate("/admin");
                break;

            case "FACULTY":
                navigate("/faculty");
                break;

            case "STUDENT":
                navigate("/student");
                break;

            default:
                navigate("/");
        }

    } catch (error) {

        console.error(error);

        alert(
            error.response?.data?.message ||
            "Login Failed"
        );

    } finally {

        setLoading(false);

    }

};

    return (

        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to continue to CodingPlate"
        >

            <Box
                component="form"
                onSubmit={handleSubmit}
            >

                <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoFocus
                />

                <PasswordField
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <Box mt={3}>

                    <Button
                        type="submit"
                        loading={loading}
                    >
                        Sign In
                    </Button>

                </Box>

                <Typography
                    variant="body2"
                    align="center"
                    mt={3}
                >

                    Don't have an account?{" "}

                    <Link
                        component={RouterLink}
                        to="/register"
                    >
                        Register
                    </Link>

                </Typography>

            </Box>

        </AuthLayout>

    );

};

export default Login;