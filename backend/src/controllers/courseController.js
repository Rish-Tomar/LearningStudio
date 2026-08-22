import asyncHandler from "../utils/asyncHandler.js";

import {
    createCourse as createCourseService,
    getAllCourses as getAllCoursesService,
    getCourseById as getCourseByIdService,
    updateCourseStatus as updateCourseStatusService
} from "../services/courseService.js";


export const createCourse = asyncHandler(async (req, res) => {

    const {
        name,
        code,
        description
    } = req.body;


    /*
     * Faculty ownership comes from the
     * authenticated user.
     *
     * It must NOT come from req.body.
     */
    const facultyId = req.user._id;


    const course = await createCourseService({

        name,

        code,

        description,

        faculty: facultyId

    });


    res.status(201).json({

        success: true,

        message: "Course created successfully",

        data: course

    });

});


export const getAllCourses = asyncHandler(async (req, res) => {

    const courses =
        await getAllCoursesService();


    res.status(200).json({

        success: true,

        message: "Courses fetched successfully",

        data: courses

    });

});


export const getCourseById = asyncHandler(async (req, res) => {

    const { id } = req.params;


    const course =
        await getCourseByIdService(id);


    res.status(200).json({

        success: true,

        message: "Course fetched successfully",

        data: course

    });

});


export const updateCourseStatus = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const course =
        await updateCourseStatusService(
            id,
            status,
            req.user
        );

    res.status(200).json({

        success: true,

        message: "Course status updated successfully",

        data: course

    });

});