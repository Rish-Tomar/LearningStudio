import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import MCQQuestionFields from "./MCQQuestionFields";
import CodingQuestionFields
    from "./CodingQuestionFields";

const QuestionForm = ({
    formData,
    topics,
    onChange,
    setFormData
}) => {

    return (

        <Box
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
            />


            {/* Question Title */}

            <TextField
                label="Question Title"
                name="title"
                value={formData.title}
                onChange={onChange}
                required
                fullWidth
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
            />


            {/* Topic */}

            <FormControl
                fullWidth
                required
            >

                <InputLabel>
                    Topic
                </InputLabel>

                <Select
                    name="topic"
                    value={formData.topic}
                    label="Topic"
                    onChange={onChange}
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

            </FormControl>


            {/* Question Type */}

            <FormControl
                fullWidth
                required
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

            </FormControl>


            {/* Difficulty */}

            <FormControl
                fullWidth
                required
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

                {formData.questionType === "MCQ" && (

                    <MCQQuestionFields
                        formData={formData}
                        setFormData={setFormData}
                    />



                )}

                {formData.questionType === "CODING" && (

                    <CodingQuestionFields
                        formData={formData}
                        setFormData={setFormData}
                    />

                )}

            </FormControl>

        </Box>

    );

};


export default QuestionForm;