import {
    Box,
    Button,
    TextField,
    CircularProgress
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const TopicForm = ({
    formData,
    onChange,
    onSubmit,
    onCancel,
    loading
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
                label="Topic Name"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
                fullWidth
            />

            <TextField
                label="Topic Code"
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
                >
                    Cancel
                </Button>

                <Button
                type="submit"
                variant="contained"
                startIcon={
                    loading
                        ? <CircularProgress size={20} color="inherit" />
                        : <SaveIcon />
                }
                disabled={loading}
            >
                {loading ? "Creating..." : "Create Topic"}
            </Button>

            </Box>

        </Box>
    );
};

export default TopicForm;