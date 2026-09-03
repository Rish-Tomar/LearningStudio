import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Chip,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import assessmentService
    from "../../../services/assessmentService";


const AssessmentList = () => {

    const navigate = useNavigate();

    const [assessments, setAssessments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");


    useEffect(() => {

        const fetchAssessments = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await assessmentService
                        .getAssessments();

                setAssessments(
                    response.data || []
                );

            } catch (error) {

                console.error(
                    "Failed to fetch assessments:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load assessments"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchAssessments();

    }, []);


    const filteredAssessments =
        assessments.filter((assessment) => {

            const search =
                searchTerm.toLowerCase();

            const matchesSearch =
                assessment.title
                    ?.toLowerCase()
                    .includes(search) ||
                assessment.code
                    ?.toLowerCase()
                    .includes(search);

            const matchesStatus =
                statusFilter === "ALL" ||
                assessment.status === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );

        });


    const getStatusColor = (status) => {

        switch (status) {

            case "PUBLISHED":
                return "success";

            case "CLOSED":
                return "default";

            case "DRAFT":
            default:
                return "warning";

        }

    };


    const formatDuration = (duration) => {

        if (!duration) {
            return "—";
        }

        if (duration < 60) {
            return `${duration} min`;
        }

        const hours =
            Math.floor(duration / 60);

        const minutes =
            duration % 60;

        return minutes
            ? `${hours} hr ${minutes} min`
            : `${hours} hr`;

    };


    return (

        <DashboardLayout>

            <Box>

                {/* Header */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center"
                        },
                        gap: 2,
                        mb: 3
                    }}
                >

                    <Box>

                        <Typography
                            variant="h4"
                            fontWeight={600}
                        >
                            Assessments
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Create, manage and host
                            classroom quizzes
                        </Typography>

                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() =>
                            navigate(
                                "/faculty/assessments/create"
                            )
                        }
                    >
                        Create Quiz
                    </Button>

                </Box>


                {/* Filters */}

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        mb: 3,
                        flexWrap: "wrap"
                    }}
                >

                    <TextField
                        size="small"
                        label="Search assessments"
                        placeholder="Search by title or code"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                        sx={{
                            minWidth: {
                                xs: "100%",
                                sm: 300
                            }
                        }}
                    />

                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 150
                        }}
                    >

                        <InputLabel>
                            Status
                        </InputLabel>

                        <Select
                            value={statusFilter}
                            label="Status"
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                        >

                            <MenuItem value="ALL">
                                All
                            </MenuItem>

                            <MenuItem value="DRAFT">
                                Draft
                            </MenuItem>

                            <MenuItem value="PUBLISHED">
                                Published
                            </MenuItem>

                            <MenuItem value="CLOSED">
                                Closed
                            </MenuItem>

                        </Select>

                    </FormControl>

                </Box>


                {/* Loading */}

                {loading && (

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 8
                        }}
                    >

                        <CircularProgress />

                    </Box>

                )}


                {/* Error */}

                {!loading && error && (

                    <Typography
                        color="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Typography>

                )}


                {/* Empty */}

                {!loading &&
                    !error &&
                    filteredAssessments.length === 0 && (

                        <Paper
                            sx={{
                                p: 6,
                                textAlign: "center"
                            }}
                        >

                            <Typography
                                variant="h6"
                                fontWeight={600}
                            >
                                No assessments found
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 1, mb: 3 }}
                            >
                                Create your first quiz
                                to get started.
                            </Typography>

                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() =>
                                    navigate(
                                        "/faculty/assessments/create"
                                    )
                                }
                            >
                                Create Quiz
                            </Button>

                        </Paper>

                    )}


                {/* Assessment Cards */}

                {!loading &&
                    !error &&
                    filteredAssessments.length > 0 && (

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(2, 1fr)",
                                    xl: "repeat(3, 1fr)"
                                },
                                gap: 2
                            }}
                        >

                            {filteredAssessments.map(
                                (assessment) => (

                                    <Paper
                                        key={
                                            assessment._id
                                        }
                                        sx={{
                                            p: 2.5,
                                            border: "1px solid",
                                            borderColor:
                                                "divider",
                                            transition:
                                                "box-shadow 0.2s",
                                            "&:hover": {
                                                boxShadow: 3
                                            }
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "flex-start",
                                                gap: 2
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    minWidth: 0
                                                }}
                                            >

                                                <Typography
                                                    variant="h6"
                                                    fontWeight={600}
                                                    noWrap
                                                >
                                                    {
                                                        assessment.title
                                                    }
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mt: 0.5
                                                    }}
                                                >
                                                    Code:{" "}
                                                    {
                                                        assessment.code
                                                    }
                                                </Typography>

                                            </Box>

                                            <Chip
                                                label={
                                                    assessment.status
                                                }
                                                size="small"
                                                color={
                                                    getStatusColor(
                                                        assessment.status
                                                    )
                                                }
                                            />

                                        </Box>


                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                gap: 2,
                                                mt: 2,
                                                color:
                                                    "text.secondary"
                                            }}
                                        >

                                            <Typography
                                                variant="body2"
                                            >
                                                ⏱{" "}
                                                {
                                                    formatDuration(
                                                        assessment.duration
                                                    )
                                                }
                                            </Typography>

                                        </Box>


                                        {assessment.description && (

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    mt: 1.5,
                                                    display:
                                                        "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient:
                                                        "vertical",
                                                    overflow:
                                                        "hidden"
                                                }}
                                            >
                                                {
                                                    assessment.description
                                                }
                                            </Typography>

                                        )}


                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                gap: 1,
                                                mt: 2.5,
                                                pt: 2,
                                                borderTop:
                                                    "1px solid",
                                                borderColor:
                                                    "divider"
                                            }}
                                        >

                                            <Button
                                                size="small"
                                                startIcon={
                                                    <VisibilityIcon />
                                                }
                                                onClick={() =>
                                                    navigate(
                                                        `/faculty/assessments/${assessment._id}`
                                                    )
                                                }
                                            >
                                                Preview
                                            </Button>

                                            {assessment.status ===
                                                "DRAFT" && (

                                                <Button
                                                    size="small"
                                                    startIcon={
                                                        <EditIcon />
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/faculty/assessments/${assessment._id}/edit`
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </Button>

                                            )}

                                            {assessment.status ===
                                                "PUBLISHED" && (

                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={
                                                        <PlayArrowIcon />
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/faculty/assessments/${assessment._id}/host`
                                                        )
                                                    }
                                                >
                                                    Host Live
                                                </Button>

                                            )}

                                        </Box>

                                    </Paper>

                                )
                            )}

                        </Box>

                    )}

            </Box>

        </DashboardLayout>

    );

};

export default AssessmentList;