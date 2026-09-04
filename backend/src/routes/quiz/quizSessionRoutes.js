import express from "express";

import {
    createQuizSession,
    getQuizSessionById,
    joinQuizSession,
    startQuizSession,
    endQuizSession,
    submitQuizResponse,
    submitQuizAttempt,
    getQuizLeaderboard,
    getQuizResultController,
    getCompletedQuizSessionsController
} from "../../controllers/Quiz/quizSessionController.js";
// import { startQuizSession } from "../../controllers/Quiz/quizSessionController.js";
import {
    protect,
    authorize
} from "../../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/", protect, authorize("FACULTY", "ADMIN"), createQuizSession);

router.get(
    "/completed",
    protect,
    authorize("FACULTY", "ADMIN"),
    getCompletedQuizSessionsController
);

router.get("/:id", protect, getQuizSessionById);

router.post(
    "/join",
    protect,
    authorize("STUDENT"),
    joinQuizSession
);

router.post(
    "/:id/responses",
    protect,
    authorize("STUDENT"),
    submitQuizResponse
);

router.post(
    "/:id/submit",
    protect,
    authorize("STUDENT"),
    submitQuizAttempt
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

router.get(
    "/:id/leaderboard",
    protect,
    authorize("STUDENT", "FACULTY", "ADMIN"),
    getQuizLeaderboard
);

router.get(
    "/:id/result",
    protect,
    authorize("STUDENT"),
    getQuizResultController
);




export default router;