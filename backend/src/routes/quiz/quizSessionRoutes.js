import express from "express";

import {
    createQuizSession,
    getQuizSessionById,
    joinQuizSession,
    startQuizSession,
    endQuizSession
} from "../../controllers/Quiz/quizSessionController.js";
// import { startQuizSession } from "../../controllers/Quiz/quizSessionController.js";
import {
    protect,
    authorize
} from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("FACULTY", "ADMIN"),
    createQuizSession
);

router.get(
    "/:id",
    protect,
    getQuizSessionById
);

router.post(
    "/join",
    protect,
    authorize("STUDENT"),
    joinQuizSession
);

router.patch(
    "/:id/start",
    protect,
    authorize("FACULTY", "ADMIN"),
    startQuizSession
);

router.patch(
    "/:id/end",
    protect,
    authorize("FACULTY", "ADMIN"),
    endQuizSession
);

export default router;