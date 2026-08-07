// import Typography from "@mui/material/Typography";

// import DashboardLayout from "../../layouts/DashboardLayout";

// const FacultyDashboard = () => {

//     return (

//         <DashboardLayout>

//             <Typography variant="h4">

//                 Faculty Dashboard

//             </Typography>

//         </DashboardLayout>

//     );

// };

// export default FacultyDashboard;

            // import DashboardLayout from "../../layouts/DashboardLayout";

            // import RecentAssessmentsPanel
            // from "../../components/dashboard/recentAssessments/RecentAssessmentsPanel.js";

            // const FacultyDashboard = () => {

            //     return (

            //         <DashboardLayout>

            //             <RecentAssessmentsPanel />

            //         </DashboardLayout>

            //     );

            // };

            // export default FacultyDashboard;

import DashboardLayout from "../../layouts/DashboardLayout";

import RecentAssessmentsPanel
from "../../components/dashboard/recentAssessments/RecentAssessmentsPanel";

import AnalyticsSection
from "../../components/dashboard/Analytics/AnalyticsSection";
import MyClassesPanel
from "../../components/dashboard/Classes/MyClassesPanel";
import QuickActionsPanel
from "../../components/dashboard/QuickActions/QuickActionsPanel";
const FacultyDashboard = () => {

    return (

        <DashboardLayout>

            <RecentAssessmentsPanel />

            <AnalyticsSection />

            <MyClassesPanel />

            <QuickActionsPanel />

        </DashboardLayout>

    );

};

export default FacultyDashboard;