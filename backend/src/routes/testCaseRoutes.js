import express from "express";

import {
    createTestCase,
    getTestCasesByQuestion,
    getPublicTestCasesByQuestion
} from "../controllers/testCaseController.js";

const router = express.Router();

router.get(
    "/question/:questionId/public",
    getPublicTestCasesByQuestion
);

router.get(
    "/question/:questionId",
    getTestCasesByQuestion
);

router.post("/", createTestCase);



export default router;