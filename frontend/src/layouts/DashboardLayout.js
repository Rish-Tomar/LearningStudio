import { Box, Toolbar } from "@mui/material";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

const DashboardLayout = ({ children }) => {

    return (

        <Box sx={{ display: "flex" }}>

            <Header />

            <Sidebar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                }}
            >

                <Toolbar />

                {children}

            </Box>

        </Box>

    );

};

export default DashboardLayout;