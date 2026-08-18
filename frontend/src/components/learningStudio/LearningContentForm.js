import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";


const LearningContentForm = ({
    formData,
    onChange,
    onSubmit,
    onCancel,
    loading = false,
    submitLabel = "Create Content",
    remainingWeight = null,
}) => {

    return (

        <Box
            component="form"
            onSubmit={onSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
            }}
        >

            <TextField
                label="Content Title"
                name="title"
                value={formData.title}
                onChange={onChange}
                required
                fullWidth
            />


            <TextField
                label="Content"
                name="content"
                value={formData.content}
                onChange={onChange}
                required
                multiline
                rows={8}
                fullWidth
            />


            <TextField
                label="Sequence"
                name="sequence"
                type="number"
                value={formData.sequence}
                onChange={onChange}
                required
                fullWidth
                inputProps={{
                    min: 1,
                }}
            />


            <TextField
                label="Completion Weight (%)"
                name="completionWeight"
                type="number"
                value={formData.completionWeight}
                onChange={onChange}
                required
                fullWidth
                error={
                    remainingWeight !== null &&
                    Number(formData.completionWeight || 0) >
                        remainingWeight
                }
                helperText={
                    remainingWeight !== null
                        ? `Available weight: ${remainingWeight}%. This weight contributes to the topic's overall completion weight.`
                        : "This weight contributes to the topic's overall completion weight."
                }
                inputProps={{
                    min: 1,
                    max: 100,
                }}
            />


            {remainingWeight !== null &&
                Number(formData.completionWeight || 0) >
                    remainingWeight && (

                <Typography
                    variant="body2"
                    color="error"
                >
                    Completion weight cannot exceed the
                    remaining topic weight of{" "}
                    {remainingWeight}%.
                </Typography>

            )}


            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 1,
                }}
            >

                <Button
                    type="button"
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>


                <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                        loading ? (
                            <CircularProgress
                                size={20}
                                color="inherit"
                            />
                        ) : (
                            <SaveIcon />
                        )
                    }
                    disabled={
                        loading ||
                        (
                            remainingWeight !== null &&
                            Number(
                                formData.completionWeight || 0
                            ) > remainingWeight
                        )
                    }
                >
                    {loading
                        ? "Saving..."
                        : submitLabel}
                </Button>

            </Box>

        </Box>

    );

};


export default LearningContentForm;