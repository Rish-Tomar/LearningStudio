import Grid from "@mui/material/Grid";

import AssessmentChart from "./AssessmentChart";
import RecentAnalytics from "./RecentAnalytics";

const AnalyticsSection = () => {

    return (

        <Grid
            container
            spacing={3}
            sx={{ mt: 1 }}
        >

            <Grid
                item
                xs={12}
                md={6}
            >
                <AssessmentChart />
            </Grid>

            <Grid
                item
                xs={12}
                md={6}
            >
                <RecentAnalytics />
            </Grid>

        </Grid>

    );

};

export default AnalyticsSection;