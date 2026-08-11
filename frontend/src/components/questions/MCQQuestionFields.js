import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";


const MCQQuestionFields = ({
    formData,
    setFormData,
}) => {

    const handleOptionChange = (index, value) => {

        setFormData((previousData) => {

            const updatedOptions = [
                ...previousData.options,
            ];

            updatedOptions[index] = {
                ...updatedOptions[index],
                text: value,
            };

            return {
                ...previousData,
                options: updatedOptions,
            };

        });

    };


    const addOption = () => {

        setFormData((previousData) => {

            const existingOptions =
                previousData.options || [];

            if (existingOptions.length >= 6) {
                return previousData;
            }

            const nextKey =
                String.fromCharCode(
                    65 + existingOptions.length
                );

            return {
                ...previousData,

                options: [
                    ...existingOptions,
                    {
                        key: nextKey,
                        text: "",
                    },
                ],
            };

        });

    };


    const removeOption = (index) => {

        setFormData((previousData) => {

            const existingOptions =
                previousData.options || [];

            if (existingOptions.length <= 2) {
                return previousData;
            }

            const updatedOptions =
                existingOptions.filter(
                    (_, optionIndex) =>
                        optionIndex !== index
                );

            const reindexedOptions =
                updatedOptions.map(
                    (option, optionIndex) => ({
                        ...option,
                        key: String.fromCharCode(
                            65 + optionIndex
                        ),
                    })
                );

            let correctAnswer =
                previousData.correctAnswer;

            const correctAnswerExists =
                reindexedOptions.some(
                    (option) =>
                        option.key === correctAnswer
                );

            if (!correctAnswerExists) {
                correctAnswer = "";
            }

            return {
                ...previousData,
                options: reindexedOptions,
                correctAnswer,
            };

        });

    };


    const handleCorrectAnswerChange = (event) => {

        setFormData((previousData) => ({
            ...previousData,
            correctAnswer: event.target.value,
        }));

    };


    const handleExplanationChange = (event) => {

        setFormData((previousData) => ({
            ...previousData,
            explanation: event.target.value,
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
                MCQ Configuration
            </Typography>


            {/* Options */}

            <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ mb: 2 }}
            >
                Options
            </Typography>


            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >

                {formData.options?.map(
                    (option, index) => (

                        <Box
                            key={option.key}
                            sx={{
                                display: "flex",
                                gap: 2,
                                alignItems: "center",
                            }}
                        >

                            <Typography
                                sx={{
                                    width: 30,
                                    fontWeight: 600,
                                }}
                            >
                                {option.key}
                            </Typography>


                            <TextField
                                label={`Option ${option.key}`}
                                value={option.text}
                                onChange={(event) =>
                                    handleOptionChange(
                                        index,
                                        event.target.value
                                    )
                                }
                                required
                                fullWidth
                            />


                            <Button
                                type="button"
                                color="error"
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                onClick={() =>
                                    removeOption(index)
                                }
                                disabled={
                                    formData.options.length <= 2
                                }
                            >
                                Remove
                            </Button>

                        </Box>

                    )
                )}

            </Box>


            {/* Add Option */}

            <Button
                type="button"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addOption}
                disabled={
                    formData.options?.length >= 6
                }
                sx={{ mt: 2 }}
            >
                Add Option
            </Button>


            {/* Correct Answer */}

            <FormControl
                fullWidth
                required
                sx={{ mt: 3 }}
            >

                <InputLabel>
                    Correct Answer
                </InputLabel>

                <Select
                    value={
                        formData.correctAnswer || ""
                    }
                    label="Correct Answer"
                    onChange={
                        handleCorrectAnswerChange
                    }
                >

                    <MenuItem value="">
                        Select Correct Answer
                    </MenuItem>

                    {formData.options?.map(
                        (option) => (

                            <MenuItem
                                key={option.key}
                                value={option.key}
                            >
                                {option.key}
                            </MenuItem>

                        )
                    )}

                </Select>

            </FormControl>


            {/* Explanation */}

            <TextField
                label="Explanation"
                value={
                    formData.explanation || ""
                }
                onChange={
                    handleExplanationChange
                }
                multiline
                rows={4}
                fullWidth
                sx={{ mt: 3 }}
            />

        </Box>

    );

};


export default MCQQuestionFields;