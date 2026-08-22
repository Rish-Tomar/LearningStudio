import mongoose from "mongoose";

import Course from "../models/Course.js";

import AppError from "../utils/AppError.js";

import { COURSE_STATUS } from "../constants/courseStatus.js";


/*
 * =========================================================
 * CLASSROOM CODE GENERATION
 * =========================================================
 */

const generateClassroomCode = () => {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

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

        classroomCode =
            generateClassroomCode();

        existingCourse =
            await Course.findOne({
                classroomCode
            });

    } while (existingCourse);


    return classroomCode;
};


/*
 * =========================================================
 * CREATE COURSE
 * =========================================================
 *
 * Faculty ownership is supplied by the controller
 * from req.user._id.
 *
 * The faculty ID is therefore trusted only after
 * authentication and authorization.
 */

export const createCourse = async ({
    faculty,
    name,
    code,
    description
}) => {

    /*
     * Validate faculty ID.
     */

    if (
        !mongoose.Types.ObjectId.isValid(
            faculty
        )
    ) {

        throw new AppError(
            "Invalid faculty ID",
            400
        );

    }


    /*
     * Check whether the course code
     * already exists.
     */

    const existingCourse =
        await Course.findOne({
            code
        });


    if (existingCourse) {

        throw new AppError(
            "Course with this code already exists",
            409
        );

    }


    /*
     * Generate a unique classroom code.
     */

    const classroomCode =
        await generateUniqueClassroomCode();


    /*
     * Create the course.
     */

    const course =
        await Course.create({

            faculty,

            name,

            code,

            description,

            classroomCode

        });


    return course;

};


/*
 * =========================================================
 * GET ALL COURSES
 * =========================================================
 */

export const getAllCourses = async () => {

    const courses =
        await Course.find()

            .populate(
                "faculty",
                "name email role"
            )

            .sort({
                createdAt: -1
            });


    return courses;

};


/*
 * =========================================================
 * GET COURSE BY ID
 * =========================================================
 */

export const getCourseById = async (id) => {

    if (
        !mongoose.Types.ObjectId.isValid(id)
    ) {

        throw new AppError(
            "Invalid course ID",
            400
        );

    }


    const course =
        await Course.findById(id)

            .populate(
                "faculty",
                "name email role"
            );


    if (!course) {

        throw new AppError(
            "Course not found",
            404
        );

    }


    return course;

};


/*
 * =========================================================
 * UPDATE COURSE STATUS
 * =========================================================
 */

export const updateCourseStatus = async (
    id,
    status,
    user
) => {

    if (
        !mongoose.Types.ObjectId.isValid(id)
    ) {

        throw new AppError(
            "Invalid course ID",
            400
        );

    }


    if (
        !Object.values(
            COURSE_STATUS
        ).includes(status)
    ) {

        throw new AppError(
            "Invalid course status",
            400
        );

    }


    const course =
        await Course.findById(id);


    if (!course) {

        throw new AppError(
            "Course not found",
            404
        );

    }


    /*
     * ADMIN can manage any course.
     *
     * FACULTY can manage only their own course.
     */

    if (
        user.role !== "ADMIN" &&
        course.faculty.toString() !==
        user._id.toString()
    ) {

        throw new AppError(
            "You are not authorized to manage this course",
            403
        );

    }


    course.status = status;


    await course.save();


    return course;

};