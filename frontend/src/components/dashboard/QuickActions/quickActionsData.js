import MenuBookIcon from "@mui/icons-material/MenuBook";
import CodeIcon from "@mui/icons-material/Code";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupsIcon from "@mui/icons-material/Groups";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PublishIcon from "@mui/icons-material/Publish";

const quickActions = [

    {
        id: 1,
        title: "Create Topic",
        icon: MenuBookIcon,
        path: "/faculty/topics/create",
    },

    {
        id: 2,
        title: "Add Question",
        icon: CodeIcon,
        path: "/faculty/questions/create",
    },

    {
        id: 3,
        title: "Create Test",
        icon: AssignmentIcon,
        path: "/faculty/tests/create",
    },

    {
        id: 4,
        title: "Manage Classes",
        icon: GroupsIcon,
        path: "/faculty/classes",
    },

    {
        id: 5,
        title: "View Reports",
        icon: AssessmentIcon,
        path: "/faculty/reports",
    },

    {
        id: 6,
        title: "Publish Test",
        icon: PublishIcon,
        path: "/faculty/tests/publish",
    },

];

export default quickActions;