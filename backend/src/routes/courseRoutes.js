import express from "express";

import {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourseStatus
} from "../controllers/courseController.js";

import {
    protect,
    authorize
} from "../middlewares/authMiddleware.js";

import { ROLES } from "../constants/roles.js";

const router = express.Router();


/*
 * Faculty creates a course.
 *
 * The faculty owner is taken from the
 * authenticated user, not from the request body.
 */
router.post(
    "/",
    protect,
    authorize(
        ROLES.FACULTY,
        ROLES.ADMIN
    ),
    createCourse
);


/*
 * Courses can be viewed by authenticated users.
 *
 * This is required because students need to
 * search courses before requesting enrollment.
 */
router.get(
    "/",
    protect,
    authorize(
        ROLES.FACULTY,
        ROLES.STUDENT,
        ROLES.ADMIN
    ),
    getAllCourses
);


router.get(
    "/:id",
    protect,
    authorize(
        ROLES.FACULTY,
        ROLES.STUDENT,
        ROLES.ADMIN
    ),
    getCourseById
);


router.patch(
    "/:id/status",
    protect,
    authorize(
        ROLES.FACULTY,
        ROLES.ADMIN
    ),
    updateCourseStatus
);


export default router;