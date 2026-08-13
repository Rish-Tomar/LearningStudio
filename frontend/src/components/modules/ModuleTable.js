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

const ModuleTable = ({
    modules = []
}) => {

    const navigate = useNavigate();

    const sortedModules = [...modules].sort(
        (first, second) =>
            (first.sequence || 0) -
            (second.sequence || 0)
    );

    const handleManageTopics = (moduleId) => {

        navigate(
            `/faculty/modules/${moduleId}/topics`
        );

    };

    return (
        <TableContainer
            component={Paper}
            elevation={2}
        >
            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>#</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Module</strong>
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

                    {sortedModules.map((module) => (

                        <TableRow
                            key={module._id}
                            hover
                        >

                            <TableCell>
                                {module.sequence}
                            </TableCell>

                            <TableCell>
                                {module.name}
                            </TableCell>

                            <TableCell>
                                {module.code}
                            </TableCell>

                            <TableCell>
                                {module.description || "-"}
                            </TableCell>

                            <TableCell>

                                <Chip
                                    label={module.status}
                                    color={
                                        module.status === "ACTIVE"
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
                                        handleManageTopics(
                                            module._id
                                        )
                                    }
                                >
                                    Manage Topics
                                </Button>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>
        </TableContainer>
    );
};

export default ModuleTable;