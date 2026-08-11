import api from "../api/axios";

const getTopics = async () => {

    const response = await api.get(
        "/topics"
    );

    return response.data;
};

const getTopicById = async (id) => {

    const response = await api.get(
        `/topics/${id}`
    );

    return response.data;
};

const createTopic = async (topicData) => {

    const response = await api.post(
        "/topics",
        topicData
    );

    return response.data;
};

const updateTopic = async (id, topicData) => {

    const response = await api.patch(
        `/topics/${id}`,
        topicData
    );

    return response.data;
};

const topicService = {

    getTopics,
    getTopicById,
    createTopic,
    updateTopic

};



export default topicService;