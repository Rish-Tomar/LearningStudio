import {
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";

const QuestionTable = ({ questions }) => {

    const navigate = useNavigate();

    return (
        <TableContainer component={Paper}>

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>Question</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Type</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Topic</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Difficulty</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Status</strong>
                        </TableCell>

                        <TableCell align="right">
                            <strong>Actions</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {questions.map((question) => (

                        <TableRow
                            key={question._id}
                            hover
                        >

                            <TableCell>
                                {question.title}
                            </TableCell>

                            <TableCell>

                                <Chip
                                    label={question.questionType}
                                    size="small"
                                    color={
                                        question.questionType === "MCQ"
                                            ? "primary"
                                            : "secondary"
                                    }
                                />

                            </TableCell>

                            <TableCell>
                                {question.topic?.name || "-"}
                            </TableCell>

                            <TableCell>
                                {question.difficulty || "-"}
                            </TableCell>

                            <TableCell>

                                <Chip
                                    label={question.status}
                                    size="small"
                                    color={
                                        question.status === "ACTIVE"
                                            ? "success"
                                            : "default"
                                    }
                                />

                            </TableCell>

                            <TableCell align="right">

                                <Tooltip title="View Question">

                                    <IconButton
                                        color="primary"
                                        onClick={() =>
                                            navigate(
                                                `/faculty/questions/${question._id}`
                                            )
                                        }
                                    >
                                        <VisibilityIcon />
                                    </IconButton>

                                </Tooltip>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </TableContainer>
    );
};

export default QuestionTable;