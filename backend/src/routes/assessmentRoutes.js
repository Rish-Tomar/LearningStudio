import express from "express";

import {
    createAssessment,
    getAllAssessments,
    getAssessmentById,
    publishAssessment,
    closeAssessment
} from "../controllers/assessmentController.js";


const router = express.Router();


router.post("/", createAssessment);

router.get("/", getAllAssessments);
router.get("/:id", getAssessmentById);

router.patch("/:id/publish", publishAssessment);
router.patch("/:id/close", closeAssessment);


export default router;