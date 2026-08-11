import {
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    TextField,
    Typography,
} from "@mui/material";


const LANGUAGES = [
    "JAVA",
    "C",
    "CPP",
    "PYTHON",
];


const CodingQuestionFields = ({
    formData,
    setFormData,
}) => {


    const handleConstraintsChange = (event) => {

        const value = event.target.value;

        const constraints =
            value
                .split("\n")
                .map((item) => item.trim())
                .filter((item) => item !== "");

        setFormData((previousData) => ({
            ...previousData,
            constraints,
        }));

    };


    const handleLanguageChange = (
        language,
        checked
    ) => {

        setFormData((previousData) => {

            const existingLanguages =
                previousData.allowedLanguages || [];

            let updatedLanguages;

            if (checked) {

                updatedLanguages = [
                    ...existingLanguages,
                    language,
                ];

            } else {

                updatedLanguages =
                    existingLanguages.filter(
                        (item) =>
                            item !== language
                    );

            }

            return {
                ...previousData,
                allowedLanguages: updatedLanguages,
            };

        });

    };


    const handleInputChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

    };


    return (

        <Box
            sx={{
                mt: 4,
                pt: 3,
                borderTop: 1,
                borderColor: "divider",
            }}
        >

            <Typography
                variant="h6"
                fontWeight={600}
                sx={{ mb: 3 }}
            >
                Coding Configuration
            </Typography>


            {/* Constraints */}

            <TextField
                label="Constraints"
                placeholder={
                    "Enter one constraint per line"
                }
                value={
                    formData.constraints?.join("\n") || ""
                }
                onChange={
                    handleConstraintsChange
                }
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 3 }}
                helperText={
                    "Enter each constraint on a separate line"
                }
            />


            {/* Input Format */}

            <TextField
                label="Input Format"
                name="inputFormat"
                value={
                    formData.inputFormat || ""
                }
                onChange={
                    handleInputChange
                }
                required
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 3 }}
            />


            {/* Output Format */}

            <TextField
                label="Output Format"
                name="outputFormat"
                value={
                    formData.outputFormat || ""
                }
                onChange={
                    handleInputChange
                }
                required
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 3 }}
            />


            {/* Allowed Languages */}

            <Box sx={{ mb: 3 }}>

                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 1 }}
                >
                    Allowed Languages
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                >
                    Select at least one language
                </Typography>


                <FormGroup
                    row
                >

                    {LANGUAGES.map(
                        (language) => (

                            <FormControlLabel
                                key={language}
                                control={
                                    <Checkbox
                                        checked={
                                            formData
                                                .allowedLanguages
                                                ?.includes(
                                                    language
                                                ) || false
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleLanguageChange(
                                                language,
                                                event.target.checked
                                            )
                                        }
                                    />
                                }
                                label={language}
                            />

                        )
                    )}

                </FormGroup>

            </Box>


            {/* Execution Time */}

            <TextField
                label="Execution Time Limit"
                name="executionTimeLimit"
                type="number"
                value={
                    formData.executionTimeLimit || ""
                }
                onChange={
                    handleInputChange
                }
                required
                fullWidth
                inputProps={{
                    min: 100,
                }}
                helperText={
                    "Minimum: 100 ms"
                }
                sx={{ mb: 3 }}
            />


            {/* Memory Limit */}

            <TextField
                label="Memory Limit"
                name="memoryLimit"
                type="number"
                value={
                    formData.memoryLimit || ""
                }
                onChange={
                    handleInputChange
                }
                required
                fullWidth
                inputProps={{
                    min: 16,
                }}
                helperText={
                    "Minimum: 16 MB"
                }
            />

        </Box>

    );

};


export default CodingQuestionFields;