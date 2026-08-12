import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";


const TestCaseForm = ({
    formData,
    errors,
    onChange,
    onCancel,
    onSubmit,
    loading
}) => {

    return (

        <Card
            variant="outlined"
            sx={{ mb: 3 }}
        >

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 3 }}
                >
                    Add Test Case
                </Typography>


                {/* Input */}

                <TextField
                    label="Input"
                    name="input"
                    value={formData.input}
                    onChange={onChange}
                    required
                    multiline
                    rows={4}
                    fullWidth
                    error={
                        Boolean(errors.input)
                    }
                    helperText={
                        errors.input ||
                        "Enter the test case input"
                    }
                    sx={{ mb: 3 }}
                />


                {/* Expected Output */}

                <TextField
                    label="Expected Output"
                    name="expectedOutput"
                    value={
                        formData.expectedOutput
                    }
                    onChange={onChange}
                    required
                    multiline
                    rows={4}
                    fullWidth
                    error={
                        Boolean(
                            errors.expectedOutput
                        )
                    }
                    helperText={
                        errors.expectedOutput ||
                        "Enter the expected output"
                    }
                    sx={{ mb: 3 }}
                />


                {/* Visibility */}

                <FormControl
                    fullWidth
                    required
                    error={
                        Boolean(
                            errors.visibility
                        )
                    }
                    sx={{ mb: 3 }}
                >

                    <InputLabel>
                        Visibility
                    </InputLabel>


                    <Select
                        name="visibility"
                        value={
                            formData.visibility
                        }
                        label="Visibility"
                        onChange={onChange}
                    >

                        <MenuItem value="HIDDEN">
                            Hidden
                        </MenuItem>


                        <MenuItem value="PUBLIC">
                            Public
                        </MenuItem>

                    </Select>


                    {errors.visibility && (

                        <FormHelperText>

                            {errors.visibility}

                        </FormHelperText>

                    )}

                </FormControl>


                {/* Weight */}

                <TextField
                    label="Weight"
                    name="weight"
                    type="number"
                    value={
                        formData.weight
                    }
                    onChange={onChange}
                    required
                    fullWidth
                    inputProps={{
                        min: 1,
                    }}
                    error={
                        Boolean(errors.weight)
                    }
                    helperText={
                        errors.weight ||
                        "Minimum: 1"
                    }
                    sx={{ mb: 3 }}
                />


                {/* Execution Order */}

                <TextField
                    label="Execution Order"
                    name="executionOrder"
                    type="number"
                    value={
                        formData.executionOrder
                    }
                    onChange={onChange}
                    required
                    fullWidth
                    inputProps={{
                        min: 1,
                    }}
                    error={
                        Boolean(
                            errors.executionOrder
                        )
                    }
                    helperText={
                        errors.executionOrder ||
                        "Enter a unique execution order"
                    }
                    sx={{ mb: 3 }}
                />


                {/* Actions */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            "flex-end",
                        gap: 2,
                    }}
                >

                    <Button
                        variant="outlined"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>


                    <Button
                        variant="contained"
                        type="button"
                        onClick={onSubmit}
                        disabled={loading}
                    >
                        {loading ? "Creating...":
                        "Add Test Case"
                    }
                    </Button>

                </Box>

            </CardContent>

        </Card>

    );

};


export default TestCaseForm;