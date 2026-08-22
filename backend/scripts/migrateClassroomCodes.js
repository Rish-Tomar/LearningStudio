import dotenv from "dotenv";
import mongoose from "mongoose";

import Course from "../src/models/Course.js";

dotenv.config();

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

        classroomCode = generateClassroomCode();

        existingCourse = await Course.findOne({
            classroomCode
        });

    } while (existingCourse);

    return classroomCode;
};

const migrateClassroomCodes = async () => {

    try {

        const databaseUrl = process.env.URL;

        if (!databaseUrl) {

            throw new Error(
                "Database URL is not configured in environment variables"
            );

        }

        await mongoose.connect(databaseUrl);

        console.log(
            "Connected to MongoDB for classroom code migration"
        );

        const courses = await Course.find({
            $or: [
                {
                    classroomCode: {
                        $exists: false
                    }
                },
                {
                    classroomCode: null
                },
                {
                    classroomCode: ""
                }
            ]
        });

        console.log(
            `Courses requiring classroom codes: ${courses.length}`
        );

        for (const course of courses) {

            const classroomCode =
                await generateUniqueClassroomCode();

            course.classroomCode = classroomCode;

            await course.save();

            console.log(
                `Updated course "${course.name}" with classroom code: ${classroomCode}`
            );

        }

        console.log(
            "Classroom code migration completed successfully"
        );

    } catch (error) {

        console.error(
            "Classroom code migration failed:",
            error
        );

        process.exitCode = 1;

    } finally {

        await mongoose.connection.close();

        console.log(
            "MongoDB connection closed"
        );

    }

};

migrateClassroomCodes();