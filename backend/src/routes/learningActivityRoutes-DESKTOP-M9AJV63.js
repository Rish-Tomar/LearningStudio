import express from "express";

import {
    createLearningActivity,
    getLearningActivitiesByTopic,
    updateLearningActivity,
    updateLearningActivityStatus
} from "../controllers/learningActivityController.js";


const router = express.Router();


router.post("/",createLearningActivity);
router.get("/topic/:topicId",getLearningActivitiesByTopic);

router.patch("/:id/status",updateLearningActivityStatus);
router.patch(    "/:id",updateLearningActivity);
export default router;