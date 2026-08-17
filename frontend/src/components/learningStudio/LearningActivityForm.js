import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";


const LearningActivityForm = ({
    formData,
    questions = [],
    onChange,
    onSubmit,
    onCancel,
    loading = false,
    submitLabel = "Create Activity",
}) => {

    return (

        <Box
            component="form"
            onSubmit={onSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                maxWidth: 900,
            }}
        >

            <FormControl
                fullWidth
                required
            >

                <InputLabel>
                    Question
                </InputLabel>

                <Select
                    name="question"
                    value={formData.question}
                    onChange={onChange}
                    label="Question"
                >

                    {questions.map((question) => (

                        <MenuItem
                            key={question._id}
                            value={question._id}
                        >
                            {question.code} — {question.title}
                        </MenuItem>

                    ))}

                </Select>

            </FormControl>


            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                    },
                    gap: 2,
                }}
            >

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
                    inputProps={{
                        min: 1,
                        max: 100,
                    }}
                />

            </Box>


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
                        questions.length === 0
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


export default LearningActivityForm;