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

const Register = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        console.log(formData);

    };

    return (

        <AuthLayout
            title="Create Account"
            subtitle="Register to start using CodingPlate"
        >

            <Box
                component="form"
                onSubmit={handleSubmit}
            >

                <TextField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoFocus
                />

                <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <PasswordField
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <PasswordField
                    label="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />

                <Box mt={3}>
                    <Button
                        type="submit"
                        loading={loading}
                    >
                        Create Account
                    </Button>
                </Box>

                <Typography
                    variant="body2"
                    align="center"
                    mt={3}
                >
                    Already have an account?{" "}

                    <Link
                        component={RouterLink}
                        to="/"
                    >
                        Sign In
                    </Link>

                </Typography>

            </Box>

        </AuthLayout>

    );

};

export default Register;