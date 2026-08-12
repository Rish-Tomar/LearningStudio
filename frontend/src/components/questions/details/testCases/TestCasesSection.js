import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import testCaseService
    from "../../../../services/testCaseService";

import TestCaseCard
    from "./TestCaseCard";

import TestCaseForm
    from "./TestCaseForm";


const TestCasesSection = ({
    questionId,
}) => {

    /*
     * Test Case State
     */

    const [testCases, setTestCases] =
        useState([]);

    const [loadingTestCases, setLoadingTestCases] =
        useState(false);


    /*
     * Test Case Form State
     */

    const [showTestCaseForm, setShowTestCaseForm] = useState(false);
    const [creatingTestCase, setCreatingTestCase] =useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [submitError, setSubmitError] =useState("");

    const [testCaseForm, setTestCaseForm] =
        useState({

            input: "",

            expectedOutput: "",

            visibility: "HIDDEN",

            weight: 1,

            executionOrder: "",

        });


    const [testCaseFormErrors, setTestCaseFormErrors] =
        useState({});


    /*
     * Fetch Test Cases
     */

    useEffect(() => {

        const fetchTestCases = async () => {
            if (!questionId)
                return;

            try {
                setLoadingTestCases(true);
                const response =
                    await testCaseService
                        .getTestCasesByQuestion(
                            questionId
                        );
                console.log(   "Test cases fetched:", response );
                setTestCases( response.data || []);
            } catch (error) {
                console.error( "Failed to fetch test cases:",  error );
            } finally {
                setLoadingTestCases(false);
            }
        };

        fetchTestCases();

    }, [questionId]);
    const validateTestCaseForm = () => {

        const errors = {};


        // Input validation

        if (!testCaseForm.input.trim()) {

            errors.input =
                "Test case input is required";

        }


        // Expected output validation

        if (!testCaseForm.expectedOutput.trim()) {

            errors.expectedOutput =
                "Expected output is required";

        }


        // Visibility validation

        if (!testCaseForm.visibility) {

            errors.visibility = "Visibility is required";

        }


        // Weight validation
        const weight =Number(testCaseForm.weight);
        if (!Number.isInteger(weight) || weight < 1) {

            errors.weight =
                "Weight must be an integer greater than or equal to 1";

        }

        // Execution order validation

        const executionOrder =
            Number(testCaseForm.executionOrder);
        if (
            !Number.isInteger(executionOrder) ||
            executionOrder < 1
        ) {
            errors.executionOrder =
                "Execution order must be an integer greater than or equal to 1";
        }
        setTestCaseFormErrors(errors);
        return Object.keys(errors).length === 0;

    };


    const handleTestCaseSubmit = async () => {

        const isValid =validateTestCaseForm();

        if (!isValid)
            return;

        setSubmitMessage("");
        setSubmitError("");
        setCreatingTestCase(true);

        try {

            const testCaseData = {
                question: questionId,
                input: testCaseForm.input.trim(),
                expectedOutput: testCaseForm.expectedOutput.trim(),
                visibility:testCaseForm.visibility,
                weight: Number(testCaseForm.weight),
                executionOrder: Number( testCaseForm.executionOrder),

            };
            console.log( "Creating test case:", testCaseData );
            const response =  await testCaseService.createTestCase( testCaseData);
            console.log( "Test case created successfully:", response );

            /*
            * Add the newly created test case
            * directly to the existing list.
            */

            setTestCases(
                (previousTestCases) => [
                    ...previousTestCases,
                    response.data,
                ].sort(
                    (a, b) =>
                        a.executionOrder -
                        b.executionOrder
                )
            );


            /*  Show success message.  */
            setSubmitMessage(
                "Test case created successfully"
            );

            /*  Reset the form.  */
            setTestCaseForm({
                input: "",
                expectedOutput: "",
                visibility: "HIDDEN",
                weight: 1,
                executionOrder: "",
            });

            setTestCaseFormErrors({});
            /* Close the form.*/
            setShowTestCaseForm(false);
        } catch (error) {
            console.error( "Failed to create test case:",error);
            /*
            * Handle backend business errors.
            */
            const message =error.response?.data?.message || "Failed to create test case";
            setSubmitError(message);

        } finally {
            setCreatingTestCase(false);
        }
    };

    /*
     * Test Case Form Change Handler
     */
    const handleTestCaseFormChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;


        setTestCaseForm(
            (previousData) => ({

                ...previousData,

                [name]: value,

            })
        );


        /*
         * Clear field error when
         * user changes the field.
         */

        setTestCaseFormErrors(
            (previousErrors) => {

                if (!previousErrors[name]) {

                    return previousErrors;

                }


                const updatedErrors = {
                    ...previousErrors,
                };


                delete updatedErrors[name];


                return updatedErrors;

            }
        );

    };


    /*
     * Open Test Case Form
     */

    const handleOpenTestCaseForm = () => {

        setTestCaseFormErrors({});

        setShowTestCaseForm(true);

    };


    /*
     * Close Test Case Form
     */

    const handleCloseTestCaseForm = () => {

        setShowTestCaseForm(false);

        setTestCaseFormErrors({});

    };


    return (

        <Card sx={{ mb: 3 }}>

            <CardContent>

                {submitMessage && (

                    <Alert
                        severity="success"
                        sx={{ mb: 2 }}
                    >
                        {submitMessage}
                    </Alert>

                )}


                {submitError && (

                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {submitError}
                    </Alert>

                )}

                {/* Header */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight={600}
                    >
                        Test Cases
                    </Typography>


                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >

                        <Chip
                            label={`${testCases.length} ${
                                testCases.length === 1
                                    ? "Test Case"
                                    : "Test Cases"
                            }`}
                            variant="outlined"
                        />


                        <Button
                            variant="contained"
                            size="small"
                            startIcon={
                                <AddIcon />
                            }
                            onClick={
                                handleOpenTestCaseForm
                            }
                        >
                            Add Test Case
                        </Button>

                    </Box>

                </Box>


                <Divider
                    sx={{ mb: 3 }}
                />


                {/* Add Test Case Form */}

                {showTestCaseForm && (

                    <TestCaseForm
                        formData={testCaseForm }
                        errors={ testCaseFormErrors}
                        onChange={handleTestCaseFormChange}
                        onCancel={handleCloseTestCaseForm}
                        onSubmit={handleTestCaseSubmit}
                        loading={creatingTestCase}
                    />

                )}


                {/* Loading */}

                {loadingTestCases ? (

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 3,
                        }}
                    >

                        <CircularProgress
                            size={28}
                        />

                    </Box>

                ) : testCases.length === 0 ? (

                    <Typography
                        color="text.secondary"
                    >
                        No test cases have been
                        added for this question.
                    </Typography>

                ) : (

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >

                        {testCases.map(
                            (testCase) => (

                                <TestCaseCard
                                    key={
                                        testCase._id
                                    }
                                    testCase={
                                        testCase
                                    }
                                />

                            )
                        )}

                    </Box>

                )}

            </CardContent>

        </Card>

    );

};


export default TestCasesSection;