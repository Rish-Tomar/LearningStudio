import {
    Box,
    Button,
    CircularProgress,
    TextField,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";


const LearningContentForm = ({
    formData,
    onChange,
    onSubmit,
    onCancel,
    loading = loading,
    submitLabel = "Create Content",
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
                helperText="This weight contributes to the topic's overall completion weight."
                inputProps={{
                    min: 1,
                    max: 100,
                }}
            />

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
                    disabled={loading}
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