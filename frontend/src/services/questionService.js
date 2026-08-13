import api from "../api/axios";

const getQuestions = async () => {

    const response = await api.get(
        "/questions"
    );

    return response.data;
};

const getQuestionsByTopic = async (topicId) => {

    const response = await api.get(
        `/questions/topic/${topicId}`
    );

    return response.data;
};

const getQuestionById = async (id) => {

    const response = await api.get(
        `/questions/${id}`
    );

    return response.data;
};

const createQuestion = async (questionData) => {

    const response = await api.post(
        "/questions",
        questionData
    );

    return response.data;
};



const updateQuestionStatus = async (id, status) => {

    const response = await api.patch(
        `/questions/${id}/status`,
        { status }
    );

    return response.data;
};

const questionService = {

    getQuestions,
    getQuestionsByTopic,
    getQuestionById,
    createQuestion,
    updateQuestionStatus,

};

export default questionService;