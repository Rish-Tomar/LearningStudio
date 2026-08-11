import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Typography,
} from "@mui/material";

const TopicTable = ({ topics }) => {

    return (
        <TableContainer component={Paper}>

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>Topic</strong>
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

                    {topics.map((topic) => (

                        <TableRow
                            key={topic._id}
                            hover
                        >

                            <TableCell>
                                {topic.name}
                            </TableCell>

                            <TableCell>
                                {topic.code}
                            </TableCell>

                            <TableCell>
                                {topic.description}
                            </TableCell>

                            <TableCell>

                                <Chip
                                    label={topic.status}
                                    color={
                                        topic.status === "ACTIVE"
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

export default TopicTable;