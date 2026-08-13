import express from "express";

import {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourseStatus
} from "../controllers/courseController.js";

const router = express.Router();

router.post("/", createCourse);

router.get("/", getAllCourses);

router.get("/:id", getCourseById);

router.patch("/:id/status", updateCourseStatus);

export default router;