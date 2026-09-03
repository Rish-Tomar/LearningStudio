import api from "../api/axios";

const createQuizSession = async (sessionData) => {
    const response = await api.post(
        "/quiz-sessions",
        sessionData
    );

    return response.data;
};

const getQuizSessionById = async (id) => {
    const response = await api.get(
        `/quiz-sessions/${id}`
    );

    return response.data;
};

const joinQuizSession = async (joinCode) => {
    const response = await api.post(
        "/quiz-sessions/join",
        { joinCode }
    );

    return response.data;
};

const startQuizSession = async (id) => {
    const response = await api.patch(
        `/quiz-sessions/${id}/start`
    );

    return response.data;
};

const endQuizSession = async (id) => {
    const response = await api.patch(
        `/quiz-sessions/${id}/end`
    );

    return response.data;
};

const quizSessionService = {
    createQuizSession,
    getQuizSessionById,
    joinQuizSession,
    startQuizSession,
    endQuizSession,
};

export default quizSessionService;
