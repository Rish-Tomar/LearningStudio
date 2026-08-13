import mongoose from "mongoose";
import Module from "../models/Module.js";
import Course from "../models/Course.js";
import AppError from "../utils/AppError.js";
import { COURSE_STATUS } from "../constants/courseStatus.js";
import { MODULE_STATUS } from "../constants/moduleStatus.js";

export const createModule = async ({
    course,
    name,
    code,
    description
}) => {

    if (!mongoose.Types.ObjectId.isValid(course)) {
        throw new AppError(
            "Invalid course ID",
            400
        );
    }

    const existingCourse = await Course.findById(course);

    if (!existingCourse) {
        throw new AppError(
            "Course not found",
            404
        );
    }

    if (existingCourse.status !== COURSE_STATUS.ACTIVE) {
        throw new AppError(
            "Cannot create module under an inactive course",
            400
        );
    }

    const existingModuleByCode = await Module.findOne({
        course,
        code
    });

    if (existingModuleByCode) {
        throw new AppError(
            "Module with this code already exists in this course",
            409
        );
    }

    const lastModule = await Module.findOne({
        course
    })
        .sort({ sequence: -1 })
        .select("sequence");

    const sequence = lastModule
        ? lastModule.sequence + 1
        : 1;

    const module = await Module.create({
        course,
        name,
        code,
        description,
        sequence
    });

    return module;
};

export const getAllModules = async () => {

    const modules = await Module.find()
        .populate("course", "name code")
        .sort({
            course: 1,
            sequence: 1
        });

    return modules;
};

export const getModuleById = async (id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(
            "Invalid module ID",
            400
        );
    }

    const module = await Module.findById(id)
        .populate("course", "name code");

    if (!module) {
        throw new AppError(
            "Module not found",
            404
        );
    }

    return module;
};

export const updateModuleStatus = async (id, status) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(
            "Invalid module ID",
            400
        );
    }

    if (!Object.values(MODULE_STATUS).includes(status)) {
        throw new AppError(
            "Invalid module status",
            400
        );
    }

    const module = await Module.findById(id);

    if (!module) {
        throw new AppError(
            "Module not found",
            404
        );
    }

    module.status = status;

    await module.save();

    return module;
};