import mongoose from "mongoose";

import Course from "../models/Course.js";

import AppError from "../utils/AppError.js";

import { COURSE_STATUS } from "../constants/courseStatus.js";


const generateClassroomCode = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
        const randomIndex =
            Math.floor(
                Math.random() * characters.length
            );
        code += characters[randomIndex];
    }
    return code;
};


const generateUniqueClassroomCode = async () => {
    let classroomCode;
    let existingCourse;
    do {
        classroomCode = generateClassroomCode();
        existingCourse = await Course.findOne({
            classroomCode
        });
    } while (existingCourse);
    return classroomCode;
};


export const createCourse = async ({
    name,
    code,
    description
}) => {
    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
        throw new AppError(
            "Course with this code already exists",
            409
        );
    }

    const classroomCode =  await generateUniqueClassroomCode();

    const course = await Course.create({
        name,
        code,
        description,
        classroomCode
    });
    return course;
};


export const getAllCourses = async () => {

    const courses = await Course.find()
        .sort({ createdAt: -1 });

    return courses;

};


export const getCourseById = async (id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {

        throw new AppError(
            "Invalid course ID",
            400
        );

    }

    const course = await Course.findById(id);

    if (!course) {

        throw new AppError(
            "Course not found",
            404
        );

    }

    return course;

};


export const updateCourseStatus = async (
    id,
    status
) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {

        throw new AppError(
            "Invalid course ID",
            400
        );

    }

    if (!Object.values(COURSE_STATUS).includes(status)) {

        throw new AppError(
            "Invalid course status",
            400
        );

    }

    const course = await Course.findById(id);

    if (!course) {

        throw new AppError(
            "Course not found",
            404
        );

    }

    course.status = status;

    await course.save();

    return course;

};