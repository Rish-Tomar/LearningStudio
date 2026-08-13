import asyncHandler from "../utils/asyncHandler.js";

import {
    createModule as createModuleService,
    getAllModules as getAllModulesService,
    getModuleById as getModuleByIdService,
    updateModuleStatus as updateModuleStatusService
} from "../services/moduleService.js";

export const createModule = asyncHandler(async (req, res) => {

    const {
        course,
        name,
        code,
        description,
        sequence
    } = req.body;

    const module = await createModuleService({
        course,
        name,
        code,
        description,
        sequence
    });

    res.status(201).json({
        success: true,
        message: "Module created successfully",
        data: module
    });
});

export const getAllModules = asyncHandler(async (req, res) => {

    const modules = await getAllModulesService();

    res.status(200).json({
        success: true,
        message: "Modules fetched successfully",
        data: modules
    });
});

export const getModuleById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const module = await getModuleByIdService(id);

    res.status(200).json({
        success: true,
        message: "Module fetched successfully",
        data: module
    });
});

export const updateModuleStatus = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const module = await updateModuleStatusService(
        id,
        status
    );

    res.status(200).json({
        success: true,
        message: "Module status updated successfully",
        data: module
    });
});