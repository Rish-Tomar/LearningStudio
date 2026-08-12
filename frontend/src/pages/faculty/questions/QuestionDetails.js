import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    CircularProgress,    
} from "@mui/material";

import { useParams } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import questionService  from "../../../services/questionService";
import QuestionHeader from "../../../components/questions/details/QuestionHeader";
import QuestionBasicInfo from "../../../components/questions/details/QuestionBasicInfo";
import CodingQuestionDetails from "../../../components/questions/details/CodingQuestions/CodingQuestionDetails";
import MCQQuestionDetails from "../../../components/questions/details/MCQQuestions/MCQQuestionDetails";
import TestCasesSection from "../../../components/questions/details/testCases/TestCasesSection";


const QuestionDetails = () => {

    const { id } = useParams();


    /*
     * Question State
     */

    const [question, setQuestion] = useState(null);
    const [loading, setLoading] =useState(true);
    const [error, setError] =useState("");
    
    /*
     * Fetch Question
     */

    useEffect(() => {

        const fetchQuestion = async () => {

            try {

                setLoading(true);
                setError("");
                const response =await questionService .getQuestionById(id);
                console.log( "Question fetched:",response);
                setQuestion(response.data);

            } catch (error) {
                console.error("Failed to fetch question:",error );
                setError( error.response?.data?.message ||"Failed to load question");
            } finally {
                setLoading(false);
            }

        };
        fetchQuestion();
    }, [id]);


    /*
     * Loading State
     */

    if (loading) {
        return (
            <DashboardLayout>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 300,
                    }}
                >
                    <CircularProgress />
                </Box>
            </DashboardLayout>
        );
    }


    /*
     * Error State
     */

    if (error) {
        return (
            <DashboardLayout>
                <Alert severity="error">
                    {error}
                </Alert>
            </DashboardLayout>
        );
    }

    /*
     * Question Not Found
     */

    if (!question) {
        return (
            <DashboardLayout>
                <Alert severity="warning">
                    Question not found.
                </Alert>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout>
            <Box>
                {/* Header */}
                <QuestionHeader/>

                {/* Basic Information */}
                <QuestionBasicInfo question={question}/>

                {/* Coding Question */}
                {question.questionType === "CODING" && (
                    <>
                        <CodingQuestionDetails question={question}/>
                        <TestCasesSection questionId={question._id}/>
                    </>
                )}

                {/* MCQ Question */}
                {question.questionType === "MCQ" && (
                    <MCQQuestionDetails question={question}/>
                )}
            </Box>
        </DashboardLayout>
    );

};
export default QuestionDetails;