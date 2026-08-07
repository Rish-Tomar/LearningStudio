import {
    Drawer,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from "@mui/material";

const drawerWidth = 240;

const Sidebar = () => {

    return (

        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
        >

            <Toolbar />

            <List>

                <ListItem disablePadding>
                    <ListItemButton>

                        <ListItemText
                            primary="Dashboard"
                        />

                    </ListItemButton>
                </ListItem>

            </List>

        </Drawer>

    );

};

export default Sidebar;