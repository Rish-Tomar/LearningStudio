import { useState } from "react";

import {
    Alert,
    Box,
    Card,
    CardContent,
    Snackbar,
    Typography,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "./../../layouts/DashboardLayout";

import ModuleForm from "./../../components/modules/ModuleForm.js";
import moduleService from "./../../services/moduleService";
const CreateModule = () => {

    const { courseId } = useParams();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState(false);

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setLoading(true);

            setError("");

            /*
             * Sequence will be handled by the
             * current frontend workflow.
             *
             * For the first module it will be 1.
             * The Course Modules page will determine
             * the next sequence when this page is
             * opened from there.
             */


            const response =
                await moduleService.createModule({
                    course: courseId,
                    ...formData,
                });

            console.log(
                "Module created successfully:",
                response
            );

            setSuccess(true);

            setTimeout(() => {

                navigate(
                    `/faculty/courses/${courseId}/modules`
                );

            }, 1000);

        } catch (error) {

            console.error(
                "Failed to create module:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create module"
            );

        } finally {

            setLoading(false);

        }

    };

    const handleCancel = () => {

        navigate(
            `/faculty/courses/${courseId}/modules`
        );

    };

    return (

        <DashboardLayout>

            <Box>

                <Box sx={{ mb: 3 }}>

                    <Typography
                        variant="h4"
                        fontWeight={600}
                    >
                        Create Module
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Add a module to this course
                    </Typography>

                </Box>

                <Card elevation={2}>

                    <CardContent sx={{ p: 3 }}>

                        <ModuleForm
                            formData={formData}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            loading={loading}
                        />

                    </CardContent>

                </Card>

                <Snackbar
                    open={success}
                    autoHideDuration={2000}
                    onClose={() => setSuccess(false)}
                >
                    <Alert
                        severity="success"
                        variant="filled"
                    >
                        Module created successfully
                    </Alert>
                </Snackbar>

                {error && (

                    <Alert
                        severity="error"
                        sx={{ mt: 2 }}
                    >
                        {error}
                    </Alert>

                )}

            </Box>

        </DashboardLayout>

    );
};

export default CreateModule;