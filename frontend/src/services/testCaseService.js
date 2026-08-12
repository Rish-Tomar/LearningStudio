import api from "../api/axios";


const createTestCase = async (testCaseData) => {

    const response = await api.post(
        "/test-cases",
        testCaseData
    );

    return response.data;

};


const getTestCasesByQuestion = async (
    questionId
) => {

    const response = await api.get(
        `/test-cases/question/${questionId}`
    );

    return response.data;

};


const getPublicTestCasesByQuestion = async (
    questionId
) => {

    const response = await api.get(
        `/test-cases/question/${questionId}/public`
    );

    return response.data;

};


const testCaseService = {
    createTestCase,
    getTestCasesByQuestion,
    getPublicTestCasesByQuestion,

};


export default testCaseService;