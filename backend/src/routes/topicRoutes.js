import express from "express";
import { createTopic,getAllTopics, getTopicById,getTopicsByModule,updateTopicStatus } from "../controllers/topicController.js";

const router = express.Router();

router.post("/", createTopic);

router.get("/", getAllTopics);

router.get("/module/:moduleId", getTopicsByModule);

router.get("/:id",getTopicById)

router.patch("/:id/status", updateTopicStatus);

export default router;