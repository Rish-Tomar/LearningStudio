import {
    Button,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const CourseTable = ({
    courses = []
}) => {

    const navigate = useNavigate();

    return (
        <TableContainer
            component={Paper}
            elevation={2}
        >
            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>Course</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Code</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Description</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Status</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Actions</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {courses.map((course) => (

                        <TableRow
                            key={course._id}
                            hover
                        >

                            <TableCell>
                                {course.name}
                            </TableCell>

                            <TableCell>
                                {course.code}
                            </TableCell>

                            <TableCell>
                                {course.description || "-"}
                            </TableCell>

                            <TableCell>

                                <Chip
                                    label={course.status}
                                    color={
                                        course.status === "ACTIVE"
                                            ? "success"
                                            : "default"
                                    }
                                    size="small"
                                />

                            </TableCell>

                            <TableCell>

                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() =>
                                        navigate(
                                            `/faculty/courses/${course._id}/modules`
                                        )
                                    }
                                >
                                    Manage Modules
                                </Button>

                                <Button
                                    size="small"
                                    variant="outlined"
                                    sx={{ ml: 1 }}
                                    onClick={() =>
                                        navigate(
                                            `/faculty/courses/${course._id}/students`
                                        )
                                    }
                                >
                                    Manage Students
                                </Button>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>
        </TableContainer>
    );
};

export default CourseTable;