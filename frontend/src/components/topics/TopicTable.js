import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Tooltip
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import { useNavigate } from "react-router-dom";


const TopicTable = ({ topics }) => {

    const navigate = useNavigate();

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

                        <TableCell align="right">
                            <strong>Actions</strong>
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

                            <TableCell align="right">

                                {/* Learning Studio */}

                                <Tooltip title="Learning Studio">

                                    <IconButton
                                        color="primary"
                                        onClick={() =>
                                            navigate(
                                                `/faculty/topics/${topic._id}/learning-studio`
                                            )
                                        }
                                    >

                                        <MenuBookIcon />

                                    </IconButton>

                                </Tooltip>


                                {/* Edit Topic */}

                                <Tooltip title="Edit Topic">

                                    <IconButton
                                        color="primary"
                                        onClick={() =>
                                            navigate(
                                                `/faculty/topics/${topic._id}/edit`
                                            )
                                        }
                                    >

                                        <EditIcon />

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


export default TopicTable;