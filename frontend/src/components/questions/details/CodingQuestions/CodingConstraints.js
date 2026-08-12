import {
    Box,
    Card,
    CardContent,
    Typography,
} from "@mui/material";


const CodingConstraints = ({
    constraints,
}) => {

    return (

        <Card sx={{ mb: 3 }}>

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                >
                    Constraints
                </Typography>


                {constraints?.length > 0 ? (

                    <Box
                        component="ul"
                        sx={{ mt: 1 }}
                    >

                        {constraints.map(
                            (
                                constraint,
                                index
                            ) => (

                                <li key={index}>

                                    <Typography>
                                        {constraint}
                                    </Typography>

                                </li>

                            )
                        )}

                    </Box>

                ) : (

                    <Typography
                        color="text.secondary"
                    >
                        No constraints specified.
                    </Typography>

                )}

            </CardContent>

        </Card>

    );

};


export default CodingConstraints;