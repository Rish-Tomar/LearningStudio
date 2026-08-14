import express from "express";

import {
    getLearningStudioTopic
} from "../controllers/learningStudioController.js";


const router = express.Router();


router.get(
    "/topics/:topicId",
    getLearningStudioTopic
);


export default router;