import { Button as MuiButton } from "@mui/material";

const Button = ({
    children,
    loading = false,
    ...props
}) => {
    return (
        <MuiButton
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            {...props}
        >
            {loading ? "Please wait..." : children}
        </MuiButton>
    );
};

export default Button;