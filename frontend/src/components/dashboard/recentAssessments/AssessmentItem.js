import {
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";

const AssessmentItem = ({ assessment }) => {

    return (

        <ListItemButton
            sx={{
                borderRadius: 2,
                mb: 1,

                "&:hover": {
                    backgroundColor: "action.hover",
                },
            }}
        >

            <ListItemIcon>
                <MenuBookIcon color="primary" />
            </ListItemIcon>

            <ListItemText
                primary={assessment.title}
            />

            <Typography
                sx={{
                    width: 100,
                    textAlign: "center",
                }}
            >
                {assessment.className}
            </Typography>

            <Typography
                sx={{
                    width: 120,
                    textAlign: "center",
                }}
            >
                {assessment.date}
            </Typography>

            <Typography
                sx={{
                    width: 120,
                    textAlign: "right",
                }}
            >
                {assessment.students} Students
            </Typography>

        </ListItemButton>

    );

};

export default AssessmentItem;