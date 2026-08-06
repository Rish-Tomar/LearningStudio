import { TextField as MuiTextField } from "@mui/material";

const TextField = (props) => {
    return (
        <MuiTextField
            fullWidth
            margin="normal"
            variant="outlined"
            {...props}
        />
    );
};

export default TextField;