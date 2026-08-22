import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CodeIcon from "@mui/icons-material/Code";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SchoolIcon from "@mui/icons-material/School";

export const facultyNavigation = [

    {
        title: "Dashboard",
        icon: DashboardIcon,
        path: "/faculty",
    },

    {
        title: "Topics",
        icon: MenuBookIcon,
        path: "/faculty/topics",
    },

    {
        title: "Courses",
        path: "/faculty/courses",
        icon: SchoolIcon,
    },

    {
        title: "Question Bank",
        icon: CodeIcon,
        path: "/faculty/questions",
    },

    {
        title: "Assessments",
        icon: AssignmentIcon,
        path: "/faculty/assessments",
    },

    {
        title: "Students",
        icon: PeopleIcon,
        path: "/faculty/students",
    },

    {
        title: "Reports",
        icon: AssessmentIcon,
        path: "/faculty/reports",
    },

];

export const studentNavigation = [

    {
        title: "Dashboard",
        icon: DashboardIcon,
        path: "/student",
    },

    {
        title: "My Courses",
        icon: SchoolIcon,
        path: "/student/courses",
    },

];