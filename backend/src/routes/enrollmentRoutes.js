import express from "express";

import {
    requestEnrollmentByCourse,
    requestEnrollmentByClassroomCode,
    addStudentByFaculty,
    approveEnrollment,
    rejectEnrollment,
    removeEnrollment,
    getMyEnrollments,
    getMyEnrollmentRequests,
    getCourseEnrollments,
    getPendingEnrollments,
    previewBulkEnrollment
} from "../controllers/enrollmentController.js";

import {
    protect,
    authorize
} from "../middlewares/authMiddleware.js";

import uploadExcel from "../middlewares/uploadExcel.js";

import { ROLES } from "../constants/roles.js";

const router = express.Router();


/*
 * =========================================================
 * STUDENT ENROLLMENT REQUESTS
 * =========================================================
 */


/*
 * Request enrollment by selecting/searching a course.
 *
 * POST /api/enrollments/request/course
 */
router.post(
    "/request/course",
    protect,
    authorize(ROLES.STUDENT),
    requestEnrollmentByCourse
);


/*
 * Request enrollment using classroom code.
 *
 * POST /api/enrollments/request/classroom-code
 */
router.post(
    "/request/classroom-code",
    protect,
    authorize(ROLES.STUDENT),
    requestEnrollmentByClassroomCode
);


/*
 * =========================================================
 * STUDENT ENROLLMENT INFORMATION
 * =========================================================
 */


/*
 * Get courses in which the student is currently enrolled.
 *
 * GET /api/enrollments/my
 */
router.get(
    "/my",
    protect,
    authorize(ROLES.STUDENT),
    getMyEnrollments
);


/*
 * Get all enrollment requests made by the student.
 *
 * GET /api/enrollments/my-requests
 */
router.get(
    "/my-requests",
    protect,
    authorize(ROLES.STUDENT),
    getMyEnrollmentRequests
);


/*
 * =========================================================
 * FACULTY ENROLLMENT MANAGEMENT
 * =========================================================
 */


/*
 * Faculty directly adds a student to a course.
 *
 * POST /api/enrollments/faculty/add
 */
router.post(
    "/faculty/add",
    protect,
    authorize(
        ROLES.FACULTY,
        ROLES.ADMIN
    ),
    addStudentByFaculty
);


/*
 * Get active students enrolled in a course.
 *
 * GET /api/enrollments/course/:courseId
 */
router.get(
    "/course/:courseId",
    protect,
    authorize(
        ROLES.FACULTY,
        ROLES.ADMIN
    ),
    getCourseEnrollments
);


/*
 * Get pending enrollment requests for a course.
 *
 * GET /api/enrollments/course/:courseId/pending
 */
router.get(
    "/course/:courseId/pending",
    protect,
    authorize(
        ROLES.FACULTY,
        ROLES.ADMIN
    ),
    getPendingEnrollments
);


/*
 * =========================================================
 * FACULTY APPROVAL / REJECTION / REMOVAL
 * =========================================================
 */


/*
 * Approve a pending enrollment request.
 *
 * PATCH /api/enrollments/:enrollmentId/approve
 */
router.patch(
    "/:enrollmentId/approve",
    protect,
    authorize(
        ROLES.FACULTY,
        ROLES.ADMIN
    ),
    approveEnrollment
);


/*
 * Reject a pending enrollment request.
 *
 * PATCH /api/enrollments/:enrollmentId/reject
 */
router.patch(
    "/:enrollmentId/reject",
    protect,
    authorize(
        ROLES.FACULTY,
        ROLES.ADMIN
    ),
    rejectEnrollment
);


/*
 * Remove an active student enrollment.
 *
 * PATCH /api/enrollments/:enrollmentId/remove
 */
router.patch(
    "/:enrollmentId/remove",
    protect,
    authorize(
        ROLES.FACULTY,
        ROLES.ADMIN
    ),
    removeEnrollment
);

/*
 * Preview bulk student enrollment from Excel.
 *
 * POST /api/enrollments/bulk/preview
 */
router.post(
    "/bulk/preview",
    protect,
    authorize(
        ROLES.FACULTY,
        ROLES.ADMIN
    ),
    uploadExcel.single("file"),
    previewBulkEnrollment
);

export default router;