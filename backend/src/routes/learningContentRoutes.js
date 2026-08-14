import express from "express";

import {
    createLearningContent,
    getLearningContentByTopic,
    updateLearningContent
} from "../controllers/learningContentController.js";

const router = express.Router();

router.post( "/", createLearningContent);
router.get("/topic/:topicId",getLearningContentByTopic);
router.patch( "/:id", updateLearningContent);

export default router;