import express from "express";

import {
    createAssessmentQuestion
} from "../controllers/assessmentQuestionController.js";


const router = express.Router();


router.post("/", createAssessmentQuestion);


export default router;