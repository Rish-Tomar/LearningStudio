import { useState } from "react";
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const UserMenu = () => {

    const navigate = useNavigate();

    const { auth, setAuth } = useAuth();

    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {

        localStorage.removeItem("auth");

        setAuth(null);

        navigate("/");

    };

    return (

        <>

            <Box
                display="flex"
                alignItems="center"
                gap={2}
            >

                <Typography
                    variant="body2"
                    sx={{
                        display: {
                            xs: "none",
                            md: "block",
                        },
                    }}
                >
                    {auth?.user?.name}
                </Typography>

                <IconButton
                    color="inherit"
                    onClick={handleOpen}
                >

                    <Avatar>

                        {auth?.user?.name?.charAt(0)}

                    </Avatar>

                </IconButton>

            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >

                <MenuItem disabled>

                    <Box>

                        <Typography fontWeight={600}>
                            {auth?.user?.name}
                        </Typography>

                        <Typography
                            variant="caption"
                        >
                            {auth?.user?.role}
                        </Typography>

                    </Box>

                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout}>
                    Logout
                </MenuItem>

            </Menu>

        </>

    );

};

export default UserMenu;