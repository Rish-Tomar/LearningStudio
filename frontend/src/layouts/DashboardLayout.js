import { useState } from "react";

import {
    Box,
    Toolbar,
} from "@mui/material";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

const DashboardLayout = ({ children }) => {

    const [open, setOpen] = useState(true);

    const handleDrawerToggle = () => {

        setOpen((prev) => !prev);

    };

    return (

        <Box sx={{ display: "flex" }}>

            <Header
                open={open}
                onDrawerToggle={handleDrawerToggle}
            />

            <Sidebar
                open={open}
            />

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