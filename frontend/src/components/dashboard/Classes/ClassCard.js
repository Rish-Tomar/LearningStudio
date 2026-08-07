import {
    Card,
    CardContent,
    Typography,
    Stack,
    Divider,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";

const ClassCard = ({ classData }) => {

    return (

        <Card
            elevation={2}
            sx={{
                height: "100%",
                cursor: "pointer",

                transition: "0.25s",

                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                },
            }}
        >

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    {classData.classCode}
                </Typography>

                <Typography
                    color="text.secondary"
                    gutterBottom
                >
                    {classData.subject}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1}>

                    <Typography>

                        <PeopleIcon
                            fontSize="small"
                            sx={{
                                verticalAlign: "middle",
                                mr: 1,
                            }}
                        />

                        {classData.students} Students

                    </Typography>

                    <Typography>

                        <AssignmentIcon
                            fontSize="small"
                            sx={{
                                verticalAlign: "middle",
                                mr: 1,
                            }}
                        />

                        {classData.assessments} Assessments

                    </Typography>

                </Stack>

            </CardContent>

        </Card>

    );

};

export default ClassCard;