import {
    Box,
    Button,
    CircularProgress,
    TextField,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const ModuleForm = ({
    formData,
    onChange,
    onSubmit,
    onCancel,
    loading = false,
    submitLabel = "Create Module",
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
                label="Module Name"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
                fullWidth
            />

            <TextField
                label="Module Code"
                name="code"
                value={formData.code}
                onChange={onChange}
                required
                fullWidth
            />

            <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={onChange}
                multiline
                rows={4}
                fullWidth
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
                    {loading ? "Saving..." : submitLabel}
                </Button>

            </Box>

        </Box>
    );
};

export default ModuleForm;