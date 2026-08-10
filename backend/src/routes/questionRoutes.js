import express from "express";
import {
    createQuestion
} from "../controllers/questionController.js";

const router = express.Router();

router.post("/", createQuestion);

export default router;