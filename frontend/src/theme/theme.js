import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",

        primary: {
            main: "#1976d2",
        },

        secondary: {
            main: "#7b1fa2",
        },

        background: {
            default: "#f5f7fb",
            paper: "#ffffff",
        },
    },

    typography: {
        fontFamily: [
            "Inter",
            "Roboto",
            "Arial",
            "sans-serif",
        ].join(","),
    },

    shape: {
        borderRadius: 10,
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: "none",
                    fontWeight: 600,
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                },
            },
        },
    },
});

export default theme;