import {
    Card,
    CardContent,
    Typography,
    Stack,
    Divider,
} from "@mui/material";

import analyticsDummyData from "./analyticsDummyData";

const RecentAnalytics = () => {

    return (

        <Card
            elevation={2}
            sx={{ height: "100%" }}
        >

            <CardContent>

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Recent Assessment Analytics
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2}>

                    <Typography>
                        <strong>Assessment:</strong>{" "}
                        {analyticsDummyData.assessmentName}
                    </Typography>

                    <Typography>
                        <strong>Students Appeared:</strong>{" "}
                        {analyticsDummyData.totalStudents}
                    </Typography>

                    <Typography>
                        <strong>Passed:</strong>{" "}
                        {analyticsDummyData.passedStudents}
                    </Typography>

                    <Typography>
                        <strong>Failed:</strong>{" "}
                        {analyticsDummyData.failedStudents}
                    </Typography>

                    <Typography>
                        <strong>Average Score:</strong>{" "}
                        {analyticsDummyData.averageScore}
                    </Typography>

                    <Typography>
                        <strong>Average Time:</strong>{" "}
                        {analyticsDummyData.averageTime}
                    </Typography>

                </Stack>

            </CardContent>

        </Card>

    );

};

export default RecentAnalytics;