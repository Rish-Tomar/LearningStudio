import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import moduleService from "../../../services/moduleService";

import ModuleTable from "../../../components/modules/ModuleTable";

const ModuleList = () => {

    const { courseId } = useParams();

    const navigate = useNavigate();

    const [modules, setModules] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        const fetchModules = async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await moduleService.getModules();

                const allModules = response.data || [];

                const courseModules = allModules.filter(
                    (module) =>
                        module.course?._id === courseId
                );

                setModules(courseModules);

            } catch (error) {

                console.error(
                    "Failed to fetch modules:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load modules"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchModules();

    }, [courseId]);

    const handleCreateModule = () => {

        navigate(
            `/faculty/courses/${courseId}/modules/create`
        );

    };

    return (

        <DashboardLayout>

            <Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >

                    <Box>

                        <Typography
                            variant="h4"
                            fontWeight={600}
                        >
                            Modules
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Manage modules for this course
                        </Typography>

                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateModule}
                    >
                        Create Module
                    </Button>

                </Box>

                {loading && (

                    <Typography>
                        Loading modules...
                    </Typography>

                )}

                {error && (

                    <Alert severity="error">
                        {error}
                    </Alert>

                )}

                {!loading && !error && (

                    <ModuleTable
                        modules={modules}
                    />

                )}

            </Box>

        </DashboardLayout>

    );
};

export default ModuleList;