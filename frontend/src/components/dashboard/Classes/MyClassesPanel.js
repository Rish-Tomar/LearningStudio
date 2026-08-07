import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Button,
    Grid,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ClassCard from "./ClassCard";

import classDummyData from "./classDummyData";

const MyClassesPanel = () => {

    return (

       <Accordion
    defaultExpanded
    elevation={2}
    sx={{ mt: 3 }}
>

    <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
    >

        <Typography
            variant="h6"
            fontWeight={600}
        >
            My Classes
        </Typography>

    </AccordionSummary>

    <AccordionDetails>

        <Box
            display="flex"
            justifyContent="flex-end"
            mb={3}
        >

            <Button>
                View All
            </Button>

        </Box>

        <Grid
            container
            spacing={2}
        >

            {classDummyData.map((item) => (

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={item.id}
                >

                    <ClassCard
                        classData={item}
                    />

                </Grid>

            ))}

        </Grid>

    </AccordionDetails>

</Accordion>

    );

};

export default MyClassesPanel;