import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import QuizIcon from "@mui/icons-material/Quiz";
import SaveIcon from "@mui/icons-material/Save";

import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import assessmentService
    from "../../../services/assessmentService";


const getDateTimeLocalValue = (date) => {

    const offset =
        date.getTimezoneOffset();

    const localDate =
        new Date(
            date.getTime() -
            offset * 60 * 1000
        );

    return localDate
        .toISOString()
        .slice(0, 16);
};


const calculateEndTime = (
    startAt,
    duration
) => {

    if (
        !startAt ||
        !duration ||
        Number(duration) <= 0
    ) {
        return "";
    }

    const start =
        new Date(startAt);

    if (
        Number.isNaN(
            start.getTime()
        )
    ) {
        return "";
    }

    start.setMinutes(
        start.getMinutes() +
        Number(duration)
    );

    return getDateTimeLocalValue(start);
};


const EditAssessment = () => {

    const navigate = useNavigate();

    const { id } = useParams();


    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const [formData, setFormData] =
        useState({
            title: "",
            code: "",
            description: "",
            duration: "",
            startAt: "",
            endAt: ""
        });


    useEffect(() => {

        const fetchAssessment =
            async () => {

                try {

                    setLoading(true);
                    setError("");

                    const response =
                        await assessmentService
                            .getAssessmentById(id);

                    const assessment =
                        response.data;

                    if (!assessment) {

                        setError(
                            "Assessment not found."
                        );

                        return;
                    }


                    if (
                        assessment.status !==
                        "DRAFT"
                    ) {

                        setError(
                            "Only draft assessments can be edited."
                        );

                        return;
                    }


                    const startDate =
                        new Date(
                            assessment.startAt
                        );

                    const endDate =
                        new Date(
                            assessment.endAt
                        );


                    setFormData({
                        title:
                            assessment.title ||
                            "",

                        code:
                            assessment.code ||
                            "",

                        description:
                            assessment.description ||
                            "",

                        duration:
                            assessment.duration ||
                            "",

                        startAt:
                            Number.isNaN(
                                startDate.getTime()
                            )
                                ? ""
                                : getDateTimeLocalValue(
                                    startDate
                                ),

                        endAt:
                            Number.isNaN(
                                endDate.getTime()
                            )
                                ? ""
                                : getDateTimeLocalValue(
                                    endDate
                                )
                    });

                } catch (error) {

                    console.error(
                        "Failed to load assessment:",
                        error
                    );

                    setError(
                        error.response?.data?.message ||
                        "Failed to load assessment"
                    );

                } finally {

                    setLoading(false);

                }

            };


        fetchAssessment();

    }, [id]);


    const handleFormChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;


        setFormData(
            (previousData) => {

                const updatedData = {
                    ...previousData,
                    [name]: value
                };


                if (
                    name === "startAt" ||
                    name === "duration"
                ) {

                    updatedData.endAt =
                        calculateEndTime(
                            name === "startAt"
                                ? value
                                : previousData.startAt,

                            name === "duration"
                                ? value
                                : previousData.duration
                        );

                }


                return updatedData;

            }
        );

    };


    const validateForm = () => {

        if (
            !formData.title.trim()
        ) {

            setError(
                "Quiz title is required"
            );

            return false;

        }


        if (
            !Number.isInteger(
                Number(formData.duration)
            ) ||
            Number(formData.duration) <= 0
        ) {

            setError(
                "Duration must be a positive number of minutes"
            );

            return false;

        }


        const startDate =
            new Date(
                formData.startAt
            );

        const endDate =
            new Date(
                formData.endAt
            );


        if (
            Number.isNaN(
                startDate.getTime()
            ) ||
            Number.isNaN(
                endDate.getTime()
            )
        ) {

            setError(
                "Please provide valid availability dates"
            );

            return false;

        }


        if (
            endDate <= startDate
        ) {

            setError(
                "Available Until must be after Available From"
            );

            return false;

        }


        return true;

    };


    const handleSave = async () => {

        setError("");
        setSuccess("");


        if (!validateForm()) {
            return;
        }


        try {

            setSubmitting(true);


            await assessmentService
                .updateAssessment(
                    id,
                    {
                        title:
                            formData.title.trim(),

                        description:
                            formData.description.trim(),

                        duration:
                            Number(
                                formData.duration
                            ),

                        startAt:
                            new Date(
                                formData.startAt
                            ).toISOString(),

                        endAt:
                            new Date(
                                formData.endAt
                            ).toISOString()
                    }
                );


            setSuccess(
                "Quiz updated successfully"
            );


            setTimeout(() => {

                navigate(
                    `/faculty/assessments/${id}`
                );

            }, 700);

        } catch (error) {

            console.error(
                "Failed to update assessment:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update assessment"
            );

        } finally {

            setSubmitting(false);

        }

    };


    if (loading) {

        return (
            <DashboardLayout>

                <Box
                    sx={{
                        minHeight: 400,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <CircularProgress />
                </Box>

            </DashboardLayout>
        );

    }


    return (
        <DashboardLayout>

            <Box
                sx={{
                    maxWidth: 1100,
                    mx: "auto"
                }}
            >

                {/* Header */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: {
                            xs: "flex-start",
                            md: "center"
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
                            Edit Quiz
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 0.5
                            }}
                        >
                            Update your draft quiz
                        </Typography>

                    </Box>


                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBackIcon />
                        }
                        onClick={() =>
                            navigate(
                                `/faculty/assessments/${id}`
                            )
                        }
                    >
                        Back to Preview
                    </Button>

                </Box>


                {/* Messages */}

                {error && (

                    <Alert
                        severity="error"
                        sx={{
                            mb: 2
                        }}
                        onClose={() =>
                            setError("")
                        }
                    >
                        {error}
                    </Alert>

                )}


                {success && (

                    <Alert
                        severity="success"
                        sx={{
                            mb: 2
                        }}
                    >
                        {success}
                    </Alert>

                )}


                {/* Quiz Details */}

                <Card sx={{ mb: 3 }}>

                    <CardContent>

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                                mb: 3
                            }}
                        >

                            <QuizIcon
                                color="primary"
                            />

                            <Typography
                                variant="h6"
                                fontWeight={600}
                            >
                                Quiz Details
                            </Typography>

                        </Stack>


                        <Grid
                            container
                            spacing={2}
                        >

                            {/* Title */}

                            <Grid
                                item
                                xs={12}
                                md={8}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="Quiz Title"
                                    name="title"
                                    value={
                                        formData.title
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="e.g. Java Tokens Quiz"
                                />

                            </Grid>


                            {/* Code */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Quiz Code"
                                    name="code"
                                    value={
                                        formData.code
                                    }
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    helperText="Quiz code cannot be changed"
                                />

                            </Grid>


                            {/* Description */}

                            <Grid
                                item
                                xs={12}
                            >

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="Describe what students will be assessed on..."
                                />

                            </Grid>


                            {/* Duration */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Duration (minutes)"
                                    name="duration"
                                    value={
                                        formData.duration
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    inputProps={{
                                        min: 1
                                    }}
                                />

                            </Grid>


                            {/* Available From */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="datetime-local"
                                    label="Available From"
                                    name="startAt"
                                    value={
                                        formData.startAt
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />

                            </Grid>


                            {/* Available Until */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    type="datetime-local"
                                    label="Available Until"
                                    name="endAt"
                                    value={
                                        formData.endAt
                                    }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    helperText="Automatically calculated from start time and duration"
                                />

                            </Grid>

                        </Grid>

                    </CardContent>

                </Card>


                {/* Save Actions */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1.5
                    }}
                >

                    <Button
                        variant="outlined"
                        onClick={() =>
                            navigate(
                                `/faculty/assessments/${id}`
                            )
                        }
                        disabled={submitting}
                    >
                        Cancel
                    </Button>


                    <Button
                        variant="contained"
                        startIcon={
                            <SaveIcon />
                        }
                        onClick={
                            handleSave
                        }
                        disabled={
                            submitting
                        }
                    >

                        {submitting
                            ? "Saving..."
                            : "Save Changes"}

                    </Button>

                </Box>

            </Box>

        </DashboardLayout>
    );

};


export default EditAssessment;