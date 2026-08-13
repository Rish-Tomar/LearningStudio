import express from "express";

import {
    createLearningActivity,
    getLearningActivitiesByTopic
} from "../controllers/learningActivityController.js";


const router = express.Router();


router.post("/",createLearningActivity);
router.get("/topic/:topicId",getLearningActivitiesByTopic);


export default router;