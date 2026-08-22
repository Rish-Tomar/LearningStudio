// import axios from "axios";
import axios from "../api/axios.js";
/*
 * Student requests enrollment by selecting a course.
 */
const requestEnrollmentByCourse = async (courseId) => {

    const response = await axios.post(
        "/enrollments/request/course",
        {
            courseId
        }
    );

    return response.data;
};


/*
 * Student requests enrollment using classroom code.
 */
const requestEnrollmentByClassroomCode = async (
    classroomCode
) => {

    const response = await axios.post(
        "/enrollments/request/classroom-code",
        {
            classroomCode
        }
    );

    return response.data;
};


/*
 * Get courses in which the logged-in student
 * is currently enrolled.
 */
const getMyEnrollments = async () => {

    const response = await axios.get(
        "/enrollments/my"
    );

    return response.data;
};


/*
 * Get all enrollment requests made by
 * the logged-in student.
 */
const getMyEnrollmentRequests = async () => {

    const response = await axios.get(
        "/enrollments/my-requests"
    );

    return response.data;
};


/*
 * Faculty directly adds a student to a course.
 */
const addStudentByFaculty = async (
    studentId,
    courseId
) => {

    const response = await axios.post(
        "/enrollments/faculty/add",
        {
            studentId,
            courseId
        }
    );

    return response.data;
};


/*
 * Faculty gets active students enrolled
 * in a course.
 */
const getCourseEnrollments = async (
    courseId
) => {

    const response = await axios.get(
        `/enrollments/course/${courseId}`
    );

    return response.data;
};


/*
 * Faculty gets pending enrollment requests
 * for a course.
 */
const getPendingEnrollments = async (
    courseId
) => {

    const response = await axios.get(
        `/enrollments/course/${courseId}/pending`
    );

    return response.data;
};


/*
 * Faculty approves an enrollment request.
 */
const approveEnrollment = async (
    enrollmentId
) => {

    const response = await axios.patch(
        `/enrollments/${enrollmentId}/approve`
    );

    return response.data;
};


/*
 * Faculty rejects an enrollment request.
 */
const rejectEnrollment = async (
    enrollmentId
) => {

    const response = await axios.patch(
        `/enrollments/${enrollmentId}/reject`
    );

    return response.data;
};


/*
 * Faculty removes an active enrollment.
 */
const removeEnrollment = async (
    enrollmentId
) => {

    const response = await axios.patch(
        `/enrollments/${enrollmentId}/remove`
    );

    return response.data;
};


const enrollmentService = {

    requestEnrollmentByCourse,

    requestEnrollmentByClassroomCode,

    getMyEnrollments,

    getMyEnrollmentRequests,

    addStudentByFaculty,

    getCourseEnrollments,

    getPendingEnrollments,

    approveEnrollment,

    rejectEnrollment,

    removeEnrollment

};


export default enrollmentService;