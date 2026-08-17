import express from "express";

import {
    createLearningContent,
    getLearningContentByTopic,
    updateLearningContent,
    updateLearningContentStatus
} from "../controllers/learningContentController.js";

const router = express.Router();

router.post( "/", createLearningContent);
router.get("/topic/:topicId",getLearningContentByTopic);
router.patch( "/:id", updateLearningContent);
router.patch(  "/:id/status", updateLearningContentStatus);

export default router;