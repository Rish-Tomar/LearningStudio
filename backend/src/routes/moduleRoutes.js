import express from "express";

import {
    createModule,
    getAllModules,
    getModuleById,
    updateModuleStatus
} from "../controllers/moduleController.js";

const router = express.Router();

router.post("/", createModule);

router.get("/", getAllModules);

router.get("/:id", getModuleById);

router.patch("/:id/status", updateModuleStatus);

export default router;