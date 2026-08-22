import mongoose from "mongoose";

import { COURSE_STATUS } from "../constants/courseStatus.js";

const courseSchema = new mongoose.Schema(
    {
        /*
         * Faculty responsible for this course.
         */
        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User_CGPT",
            required: [true, "Faculty is required"]
        },

        name: {
            type: String,
            required: [true, "Course name is required"],
            trim: true,
            minlength: 2,
            maxlength: 150
        },

        code: {
            type: String,
            required: [true, "Course code is required"],
            unique: true,
            uppercase: true,
            trim: true,
            maxlength: 30
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500
        },

        classroomCode: {
            type: String,
            required: [true, "Classroom code is required"],
            unique: true,
            sparse: true,
            uppercase: true,
            trim: true,
            minlength: 6,
            maxlength: 12
        },

        status: {
            type: String,
            enum: Object.values(COURSE_STATUS),
            default: COURSE_STATUS.ACTIVE
        }
    },
    {
        timestamps: true
    }
);

const Course = mongoose.model(
    "Course_CGPT",
    courseSchema
);

export default Course;