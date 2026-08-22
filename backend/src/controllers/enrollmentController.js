import asyncHandler from "../utils/asyncHandler.js";

import {
    requestEnrollmentByCourse as requestEnrollmentByCourseService,
    requestEnrollmentByClassroomCode as requestEnrollmentByClassroomCodeService,
    addStudentByFaculty as addStudentByFacultyService,
    approveEnrollment as approveEnrollmentService,
    rejectEnrollment as rejectEnrollmentService,
    removeEnrollment as removeEnrollmentService,
    getMyEnrollments as getMyEnrollmentsService,
    getMyEnrollmentRequests as getMyEnrollmentRequestsService,
    getCourseEnrollments as getCourseEnrollmentsService,
    getPendingEnrollments as getPendingEnrollmentsService
} from "../services/enrollmentService.js";

/*
 * Student requests enrollment by searching/selecting a course.
 */
export const requestEnrollmentByCourse =
    asyncHandler(async (req, res) => {

        const { courseId } = req.body;

        const enrollment =
            await requestEnrollmentByCourseService({
                studentId: req.user._id,
                courseId
            });

        res.status(201).json({
            success: true,
            message: "Enrollment request submitted successfully",
            data: enrollment
        });

    });


/*
 * Student requests enrollment using classroom code.
 */
export const requestEnrollmentByClassroomCode =
    asyncHandler(async (req, res) => {

        const { classroomCode } = req.body;

        const enrollment =
            await requestEnrollmentByClassroomCodeService({
                studentId: req.user._id,
                classroomCode
            });

        res.status(201).json({
            success: true,
            message: "Enrollment request submitted successfully",
            data: enrollment
        });

    });


/*
 * Faculty directly adds a student to a course.
 */
export const addStudentByFaculty =
    asyncHandler(async (req, res) => {

        const {
            studentId,
            courseId
        } = req.body;

        const enrollment =
            await addStudentByFacultyService({
                studentId,
                courseId,
                user:req.user
            });

        res.status(201).json({
            success: true,
            message: "Student added to course successfully",
            data: enrollment
        });

    });


/*
 * Faculty approves a pending enrollment request.
 */
export const approveEnrollment =
    asyncHandler(async (req, res) => {

        const { enrollmentId } = req.params;

        const enrollment =
            await approveEnrollmentService({
                enrollmentId,
                user: req.user
            });

        res.status(200).json({
            success: true,
            message:
                "Enrollment request approved successfully",
            data: enrollment
        });

    });

/*
 * Faculty rejects a pending enrollment request.
 */

export const rejectEnrollment =
    asyncHandler(async (req, res) => {

        const { enrollmentId } = req.params;

        const enrollment =
            await rejectEnrollmentService({
                enrollmentId,
                user: req.user
            });

        res.status(200).json({
            success: true,
            message:
                "Enrollment request rejected successfully",
            data: enrollment
        });

    });

/*
 * Faculty removes an active enrollment.
 */

export const removeEnrollment =
    asyncHandler(async (req, res) => {

        const { enrollmentId } = req.params;

        const enrollment =
            await removeEnrollmentService({
                enrollmentId,
                user: req.user
            });

        res.status(200).json({
            success: true,
            message:
                "Student removed from course successfully",
            data: enrollment
        });

    });

/*
 * =========================================================
 * STUDENT — GET MY ACTIVE ENROLLMENTS
 * =========================================================
 */
export const getMyEnrollments =
    asyncHandler(async (req, res) => {

        const enrollments =
            await getMyEnrollmentsService({
                studentId: req.user._id
            });

        res.status(200).json({
            success: true,
            message: "Enrollments fetched successfully",
            data: enrollments
        });

    });


/*
 * =========================================================
 * STUDENT — GET MY ENROLLMENT REQUESTS
 * =========================================================
 */
export const getMyEnrollmentRequests =
    asyncHandler(async (req, res) => {

        const enrollments =
            await getMyEnrollmentRequestsService({
                studentId: req.user._id
            });

        res.status(200).json({
            success: true,
            message:
                "Enrollment requests fetched successfully",
            data: enrollments
        });

    });


/*
 * =========================================================
 * FACULTY — GET COURSE ENROLLMENTS
 * =========================================================
 */
export const getCourseEnrollments =
    asyncHandler(async (req, res) => {

        const { courseId } = req.params;

        const enrollments =
            await getCourseEnrollmentsService({
                courseId,
                user: req.user
            });

        res.status(200).json({
            success: true,
            message:
                "Course enrollments fetched successfully",
            data: enrollments
        });

    });


/*
 * =========================================================
 * FACULTY — GET PENDING ENROLLMENT REQUESTS
 * =========================================================
 */
export const getPendingEnrollments =
    asyncHandler(async (req, res) => {

        const { courseId } = req.params;

        const enrollments =
            await getPendingEnrollmentsService({
                courseId,
                user: req.user
            });

        res.status(200).json({
            success: true,
            message:
                "Pending enrollment requests fetched successfully",
            data: enrollments
        });

    });
