import {
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";

import { Drawer } from "./styledComponents";
import { NavLink } from "react-router-dom";
import ListItemIcon from "@mui/material/ListItemIcon";

import {
    facultyNavigation,
    studentNavigation
} from "../../config/navigation";

import { useAuth } from "../../contexts/AuthContext";

const Sidebar = ({ open }) => {

    const { auth } = useAuth();

    const navigation =
        auth?.user?.role === "STUDENT"
            ? studentNavigation
            : facultyNavigation;

    return (

        <Drawer
            variant="permanent"
            open={open}
        >

            <Toolbar />

            <List>

                {navigation.map((item) => {

                    const Icon = item.icon;

                    return (

                        <ListItem
                            key={item.title}
                            disablePadding
                            sx={{ display: "block" }}
                        >

                            <ListItemButton
                                component={NavLink}
                                to={item.path}
                                sx={{
                                    minHeight: 48,

                                    justifyContent: open
                                        ? "initial"
                                        : "center",

                                    px: 2.5,

                                    "&.active": {
                                        backgroundColor: "primary.main",
                                        color: "#fff",

                                        "& .MuiListItemIcon-root": {
                                            color: "#fff",
                                        },
                                    },
                                }}
                            >

                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,

                                        mr: open ? 3 : "auto",

                                        justifyContent: "center",
                                    }}
                                >

                                    <Icon />

                                </ListItemIcon>

                                <ListItemText
                                    primary={item.title}
                                    sx={{
                                        opacity: open ? 1 : 0,
                                    }}
                                />

                            </ListItemButton>

                        </ListItem>

                    );

                })}

            </List>

        </Drawer>

    );

};

export default Sidebar;