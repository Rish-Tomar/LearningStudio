import express from "express";

import {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestionStatus
} from "../controllers/questionController.js";

const router = express.Router();

router.get("/", getAllQuestions);

router.get("/:id", getQuestionById);

router.patch("/:id/status", updateQuestionStatus);

router.post("/", createQuestion);

export default router;