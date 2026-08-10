import express from "express";
import { createTopic,getAllTopics, getTopicById,updateTopicStatus } from "../controllers/topicController.js";

const router = express.Router();

router.post("/", createTopic);

router.get("/", getAllTopics);

router.get("/:id",getTopicById)

router.patch("/:id/status", updateTopicStatus);

export default router;