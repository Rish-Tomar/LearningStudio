import {
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

const ModuleTable = ({
    modules = []
}) => {

    const sortedModules = [...modules].sort(
        (first, second) =>
            (first.sequence || 0) -
            (second.sequence || 0)
    );

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

                        </TableRow>

                    ))}

                </TableBody>

            </Table>
        </TableContainer>
    );
};

export default ModuleTable;