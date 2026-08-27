import api from "../api/axios";

const getCourses = async () => {

    const response = await api.get(
        "/courses"
    );

    return response.data;
};

const getCourseById = async (id) => {

    const response = await api.get(
        `/courses/${id}`
    );

    return response.data;
};

const createCourse = async (courseData) => {

    const response = await api.post(
        "/courses",
        courseData
    );

    return response.data;
};

const updateCourseStatus = async (id, status) => {

    const response = await api.patch(
        `/courses/${id}/status`,
        { status }
    );

    return response.data;
};

// Add these functions inside courseService.js

const submitAssignment = async (assignmentId,data)=>{
    return await api.post(`/assignments/${assignmentId}/submit`,data);
}


const courseService = {

    getCourses,
    getCourseById,
    createCourse,
    updateCourseStatus,
    submitAssignment

};

export default courseService;