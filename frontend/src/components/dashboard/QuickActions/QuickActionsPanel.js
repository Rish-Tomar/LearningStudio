import {
    Card,
    CardContent,
    Typography,
    Grid,
} from "@mui/material";

import ActionCard from "./ActionCard";
import quickActions from "./quickActionsData";

const QuickActionsPanel = () => {

    return (

        <Card
            elevation={2}
            sx={{ mt: 3 }}
        >

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight={600}
                    mb={3}
                >
                    Quick Actions
                </Typography>

                <Grid
                    container
                    spacing={2}
                >

                    {quickActions.map((action) => (

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={2}
                            lg={2}
                            key={action.id}
                        >

                            <ActionCard
                                action={action}
                            />

                        </Grid>

                    ))}

                </Grid>

            </CardContent>

        </Card>

    );

};

export default QuickActionsPanel;