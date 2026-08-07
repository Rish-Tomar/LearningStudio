import { AppBar, Toolbar, Typography } from "@mui/material";

const Header = () => {

    return (

        <AppBar
            position="fixed"
            elevation={1}
        >
            <Toolbar>

                <Typography
                    variant="h6"
                    sx={{ fontWeight: 600 }}
                >
                    CodingPlate
                </Typography>

            </Toolbar>

        </AppBar>

    );

};

export default Header;