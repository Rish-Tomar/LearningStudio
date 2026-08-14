import api from "../api/axios";


const getLearningContentByTopic = async (topicId) => {

    const response = await api.get(
        `/learning-content/topic/${topicId}`
    );

    return response.data;
};


const createLearningContent = async (contentData) => {

    const response = await api.post(
        "/learning-content",
        contentData
    );

    return response.data;
};

const updateLearningContent = async (
    id,
    {
        title,
        content,
        sequence,
        completionWeight
    }
) => {

    const response = await api.patch(
        `/learning-content/${id}`,
        {
            title,
            content,
            sequence,
            completionWeight
        }
    );

    return response.data;
};



const learningContentService = {

    getLearningContentByTopic,
    createLearningContent,
    updateLearningContent

};



export default learningContentService;