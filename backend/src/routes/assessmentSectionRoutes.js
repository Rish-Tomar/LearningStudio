import express from "express";

import {
    createAssessmentSection
} from "../controllers/assessmentSectionController.js";


const router = express.Router();


router.post("/", createAssessmentSection);


export default router;