import MenuIcon from "@mui/icons-material/Menu";

import {
    Toolbar,
    Typography,
    IconButton,
    Box,
} from "@mui/material";
import UserMenu from "./UserMenu";
import { AppBar } from "./styledComponents";

const Header = ({ open, onDrawerToggle }) => {

    return (

        <AppBar
            position="fixed"
            open={open}
            elevation={1}
        >

            <Toolbar>

                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={onDrawerToggle}
                    sx={{
                        marginRight: 2,
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        fontWeight: 600,
                    }}
                >
                    CodingPlate
                </Typography>

                <UserMenu/>

            </Toolbar>

        </AppBar>

    );

};

export default Header;