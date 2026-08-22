import api from "../api/axios";


const getLearningActivitiesByTopic = async (topicId) => {

    const response = await api.get(
        `/learning-activities/topic/${topicId}`
    );

    return response.data;
};


const createLearningActivity = async (activityData) => {

    const response = await api.post(
        "/learning-activities",
        activityData
    );

    return response.data;
};


const updateLearningActivity = async (
    id,
    {
        question,
        completionWeight,
        sequence
    }
) => {

    const response = await api.patch(
        `/learning-activities/${id}`,
        {
            question,
            completionWeight,
            sequence
        }
    );

    return response.data;
};

const updateLearningActivityStatus = async (
    id,
    status
) => {

    const response = await api.patch(
        `/learning-activities/${id}/status`,
        {
            status
        }
    );

    return response.data;
};

const learningActivityService = {

    getLearningActivitiesByTopic,
    createLearningActivity,
    updateLearningActivity,
    updateLearningActivityStatus

};


export default learningActivityService;