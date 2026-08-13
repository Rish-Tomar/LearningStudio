import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";

import MCQQuestionFields
    from "./MCQQuestionFields";

import CodingQuestionFields
    from "./CodingQuestionFields";


const QuestionForm = ({
    formData,
    topics,
    onChange,
    setFormData,
    onSubmit,
    validationErrors,
    topicLocked = false,
    submitting = false,
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

            {/* Question Code */}

            <TextField
                label="Question Code"
                name="code"
                value={formData.code}
                onChange={onChange}
                required
                fullWidth
                error={
                    Boolean(
                        validationErrors.code
                    )
                }
                helperText={
                    validationErrors.code || ""
                }
            />


            {/* Question Title */}

            <TextField
                label="Question Title"
                name="title"
                value={formData.title}
                onChange={onChange}
                required
                fullWidth
                error={
                    Boolean(
                        validationErrors.title
                    )
                }
                helperText={
                    validationErrors.title || ""
                }
            />


            {/* Description */}

            <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={onChange}
                required
                multiline
                rows={4}
                fullWidth
                error={
                    Boolean(
                        validationErrors.description
                    )
                }
                helperText={
                    validationErrors.description || ""
                }
            />


            {/* Topic */}

            <FormControl
                fullWidth
                required
                error={
                    Boolean(
                        validationErrors.topic
                    )
                }
            >

                <InputLabel>
                    Topic
                </InputLabel>

                <Select
                    name="topic"
                    value={formData.topic}
                    label="Topic"
                    onChange={onChange}
                    disabled={topicLocked}
                >

                    <MenuItem value="">
                        Select Topic
                    </MenuItem>

                    {topics?.map((topic) => (

                        <MenuItem
                            key={topic._id}
                            value={topic._id}
                        >
                            {topic.name}
                        </MenuItem>

                    ))}

                </Select>

                {topicLocked && (

                    <FormHelperText>
                        Topic is selected from the current context.
                    </FormHelperText>

                )}

                {!topicLocked &&
                    validationErrors.topic && (

                    <FormHelperText>
                        {validationErrors.topic}
                    </FormHelperText>

                )}

            </FormControl>


            {/* Question Type */}

            <FormControl
                fullWidth
                required
                error={
                    Boolean(
                        validationErrors.questionType
                    )
                }
            >

                <InputLabel>
                    Question Type
                </InputLabel>

                <Select
                    name="questionType"
                    value={formData.questionType}
                    label="Question Type"
                    onChange={onChange}
                >

                    <MenuItem value="">
                        Select Question Type
                    </MenuItem>

                    <MenuItem value="MCQ">
                        MCQ
                    </MenuItem>

                    <MenuItem value="CODING">
                        Coding
                    </MenuItem>

                </Select>

                {validationErrors.questionType && (

                    <FormHelperText>
                        {validationErrors.questionType}
                    </FormHelperText>

                )}

            </FormControl>


            {/* Difficulty */}

            <FormControl
                fullWidth
                required
                error={
                    Boolean(
                        validationErrors.difficulty
                    )
                }
            >

                <InputLabel>
                    Difficulty
                </InputLabel>

                <Select
                    name="difficulty"
                    value={formData.difficulty}
                    label="Difficulty"
                    onChange={onChange}
                >

                    <MenuItem value="">
                        Select Difficulty
                    </MenuItem>

                    <MenuItem value="EASY">
                        Easy
                    </MenuItem>

                    <MenuItem value="MEDIUM">
                        Medium
                    </MenuItem>

                    <MenuItem value="HARD">
                        Hard
                    </MenuItem>

                </Select>

                {validationErrors.difficulty && (

                    <FormHelperText>
                        {validationErrors.difficulty}
                    </FormHelperText>

                )}

            </FormControl>


            {/* MCQ Fields */}

            {formData.questionType === "MCQ" && (

                <MCQQuestionFields
                    formData={formData}
                    setFormData={setFormData}
                    validationErrors={
                        validationErrors
                    }
                />

            )}


            {/* Coding Fields */}

            {formData.questionType === "CODING" && (

                <CodingQuestionFields
                    formData={formData}
                    setFormData={setFormData}
                    validationErrors={
                        validationErrors
                    }
                />

            )}


            {/* Submit */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                }}
            >

                <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                >
                    {submitting
                        ? "Creating..."
                        : "Create Question"}
                </Button>

            </Box>

        </Box>

    );

};


export default QuestionForm;