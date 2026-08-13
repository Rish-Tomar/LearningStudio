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

const courseService = {

    getCourses,
    getCourseById,
    createCourse,
    updateCourseStatus

};

export default courseService;