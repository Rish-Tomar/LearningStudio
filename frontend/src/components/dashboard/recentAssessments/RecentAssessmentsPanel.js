import { useState } from "react";

import {

    Accordion,
    AccordionSummary,
    AccordionDetails,

    Box,

    ToggleButton,
    ToggleButtonGroup,

    Typography,

} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import AssessmentItem from "./AssessmentItem";

import {

    codingAssessments,
    mcqAssessments,

} from "./dummyAssessmentData";

const RecentAssessmentsPanel = () => {

    const [type, setType] = useState("CODING");

    const handleTypeChange = (_, value) => {

        if (value) {

            setType(value);

        }

    };

    const assessments =

        type === "CODING"

            ? codingAssessments

            : mcqAssessments;

    return (

        <Accordion
            defaultExpanded
            elevation={2}
        >

            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >

                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    Recent Assessments
                </Typography>

            </AccordionSummary>

            <AccordionDetails>

                <Box mb={3}>

                    <ToggleButtonGroup

                        value={type}

                        exclusive

                        onChange={handleTypeChange}

                    >

                        <ToggleButton value="MCQ">

                            MCQ Assessment

                        </ToggleButton>

                        <ToggleButton value="CODING">

                            Coding Assessment

                        </ToggleButton>

                    </ToggleButtonGroup>

                </Box>

                    <Box
                        sx={{
                            display: "flex",
                            px: 2,
                            py: 1,
                            fontWeight: 600,
                            color: "text.secondary",
                        }}
                    >

                        <Box sx={{ flex: 1 }}>
                            Assessment
                        </Box>

                        <Box sx={{ width: 100, textAlign: "center" }}>
                            Class
                        </Box>

                        <Box sx={{ width: 120, textAlign: "center" }}>
                            Date
                        </Box>

                        <Box sx={{ width: 120, textAlign: "right" }}>
                            Students
                        </Box>

                    </Box>

                    {assessments.map((assessment) => (

                        <AssessmentItem

                            key={assessment.id}

                            assessment={assessment}

                        />

                    ))

                }

            </AccordionDetails>

        </Accordion>

    );

};

export default RecentAssessmentsPanel;