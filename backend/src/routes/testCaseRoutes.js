import express from "express";

import {
    createTestCase
} from "../controllers/testCaseController.js";

const router = express.Router();

router.post("/", createTestCase);

export default router;