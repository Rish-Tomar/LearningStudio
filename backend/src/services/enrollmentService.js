import mongoose from "mongoose";
import XLSX from "xlsx";
import Enrollment from "../models/Enrollment.js";
import User from "../models/Users.js";
import Course from "../models/Course.js";

import AppError from "../utils/AppError.js";

import { ENROLLMENT_STATUS } from "../constants/enrollmentStatus.js";
import { ENROLLMENT_METHOD } from "../constants/enrollmentMethod.js";
import { ROLES } from "../constants/roles.js";

/*
 * Check whether an ID is a valid MongoDB ObjectId.
 */
const validateObjectId = (id, message) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {

        throw new AppError(
            message,
            400
        );

    }

};


/*
 * Find an active course.
 */
const findActiveCourse = async (courseId) => {

    validateObjectId(
        courseId,
        "Invalid course ID"
    );

    const course = await Course.findById(courseId);

    if (!course) {

        throw new AppError(
            "Course not found",
            404
        );

    }

    if (course.status !== "ACTIVE") {

        throw new AppError(
            "Course is not active",
            400
        );

    }

    return course;

};


/*
 * Check whether the student already has
 * an enrollment record for the course.
 */
const checkExistingEnrollment = async (
    studentId,
    courseId
) => {

    const enrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId
    });

    if (!enrollment) {
        return null;
    }

    if (
        enrollment.status ===
        ENROLLMENT_STATUS.PENDING
    ) {

        throw new AppError(
            "Enrollment request is already pending",
            409
        );

    }

    if (
        enrollment.status ===
        ENROLLMENT_STATUS.ACTIVE
    ) {

        throw new AppError(
            "Student is already enrolled in this course",
            409
        );

    }

    if (
        enrollment.status ===
        ENROLLMENT_STATUS.REJECTED
    ) {

        throw new AppError(
            "Previous enrollment request was rejected",
            409
        );

    }

    if (
        enrollment.status ===
        ENROLLMENT_STATUS.REMOVED
    ) {

        throw new AppError(
            "Student was previously removed from this course",
            409
        );

    }

    return enrollment;

};


/*
 * Student requests enrollment by course ID.
 *
 * Initial status:
 * PENDING
 *
 * Method:
 * COURSE_SEARCH
 */
export const requestEnrollmentByCourse = async ({
    studentId,
    courseId
}) => {

    const course = await findActiveCourse(
        courseId
    );

    const student = await User.findById(
        studentId
    );

    if (!student) {

        throw new AppError(
            "Student not found",
            404
        );

    }

    if (student.role !== ROLES.STUDENT) {

        throw new AppError(
            "Only students can request enrollment",
            403
        );

    }

    await checkExistingEnrollment(
        studentId,
        courseId
    );

    const enrollment = await Enrollment.create({

        student: studentId,

        course: course._id,

        status: ENROLLMENT_STATUS.PENDING,

        enrollmentMethod:
            ENROLLMENT_METHOD.COURSE_SEARCH,

        requestedAt: new Date()

    });

    return enrollment;

};


/*
 * Student requests enrollment using
 * the classroom code.
 *
 * Initial status:
 * PENDING
 *
 * Method:
 * CLASS_CODE
 */
export const requestEnrollmentByClassroomCode =
    async ({
        studentId,
        classroomCode
    }) => {

        if (
            !classroomCode ||
            typeof classroomCode !== "string"
        ) {

            throw new AppError(
                "Classroom code is required",
                400
            );

        }

        const normalizedCode =
            classroomCode
                .trim()
                .toUpperCase();

        const course =
            await Course.findOne({
                classroomCode:
                    normalizedCode
            });

        if (!course) {

            throw new AppError(
                "Invalid classroom code",
                404
            );

        }

        if (course.status !== "ACTIVE") {

            throw new AppError(
                "Course is not active",
                400
            );

        }

        const student =
            await User.findById(
                studentId
            );

        if (!student) {

            throw new AppError(
                "Student not found",
                404
            );

        }

        if (
            student.role !==
            ROLES.STUDENT
        ) {

            throw new AppError(
                "Only students can request enrollment",
                403
            );

        }

        await checkExistingEnrollment(
            studentId,
            course._id
        );

        const enrollment =
            await Enrollment.create({

                student: studentId,

                course: course._id,

                status:
                    ENROLLMENT_STATUS.PENDING,

                enrollmentMethod:
                    ENROLLMENT_METHOD.CLASS_CODE,

                requestedAt:
                    new Date()

            });

        return enrollment;

    };


/*
 * Faculty directly adds a student
 * to a course.
 *
 * Initial status:
 * ACTIVE
 *
 * Method:
 * FACULTY
 */
export const addStudentByFaculty =
    async ({
        studentId,
        courseId,
        user
    }) => {

        const course =
            await findActiveCourse(
                courseId
            );


        /*
         * ADMIN can add students to any course.
         *
         * FACULTY can add students only to
         * courses owned by them.
         */

        if (
            user.role !== ROLES.ADMIN &&
            course.faculty.toString() !==
            user._id.toString()
        ) {

            throw new AppError(
                "You are not authorized to manage this course",
                403
            );

        }


        const student =
            await User.findById(
                studentId
            );


        if (!student) {

            throw new AppError(
                "Student not found",
                404
            );

        }


        if (
            student.role !==
            ROLES.STUDENT
        ) {

            throw new AppError(
                "Selected user is not a student",
                400
            );

        }


        await checkExistingEnrollment(
            studentId,
            courseId
        );


        const enrollment =
            await Enrollment.create({

                student: studentId,

                course: course._id,

                status:
                    ENROLLMENT_STATUS.ACTIVE,

                enrollmentMethod:
                    ENROLLMENT_METHOD.FACULTY,

                approvedAt:
                    new Date()

            });


        return enrollment;

    };

/*
 * Faculty approves a pending enrollment.
 */
export const approveEnrollment =
    async ({
        enrollmentId,
        user
    }) => {

        validateObjectId(
            enrollmentId,
            "Invalid enrollment ID"
        );

        const enrollment =
            await Enrollment.findById(
                enrollmentId
            ).populate(
                "course",
                "faculty name code"
            );

        if (!enrollment) {

            throw new AppError(
                "Enrollment not found",
                404
            );

        }

        if (
            user.role !== ROLES.ADMIN &&
            enrollment.course.faculty.toString() !==
            user._id.toString()
        ) {

            throw new AppError(
                "You are not authorized to manage this enrollment",
                403
            );

        }

        if (
            enrollment.status !==
            ENROLLMENT_STATUS.PENDING
        ) {

            throw new AppError(
                "Only pending enrollments can be approved",
                400
            );

        }

        enrollment.status =
            ENROLLMENT_STATUS.ACTIVE;

        enrollment.approvedAt =
            new Date();

        enrollment.rejectedAt =
            null;

        await enrollment.save();

        return enrollment;
    };
/*
 * Faculty rejects a pending enrollment.
 */
export const rejectEnrollment =
    async ({
        enrollmentId,
        user
    }) => {

        validateObjectId(
            enrollmentId,
            "Invalid enrollment ID"
        );

        const enrollment =
            await Enrollment.findById(
                enrollmentId
            ).populate(
                "course",
                "faculty name code"
            );

        if (!enrollment) {

            throw new AppError(
                "Enrollment not found",
                404
            );

        }

        if (
            user.role !== ROLES.ADMIN &&
            enrollment.course.faculty.toString() !==
            user._id.toString()
        ) {

            throw new AppError(
                "You are not authorized to manage this enrollment",
                403
            );

        }

        if (
            enrollment.status !==
            ENROLLMENT_STATUS.PENDING
        ) {

            throw new AppError(
                "Only pending enrollments can be rejected",
                400
            );

        }

        enrollment.status =
            ENROLLMENT_STATUS.REJECTED;

        enrollment.rejectedAt =
            new Date();

        enrollment.approvedAt =
            null;

        await enrollment.save();

        return enrollment;
    };

/*
 * Faculty removes an active enrollment.
 */
export const removeEnrollment =
    async ({
        enrollmentId,
        user
    }) => {

        validateObjectId(
            enrollmentId,
            "Invalid enrollment ID"
        );

        const enrollment =
            await Enrollment.findById(
                enrollmentId
            ).populate(
                "course",
                "faculty name code"
            );

        if (!enrollment) {

            throw new AppError(
                "Enrollment not found",
                404
            );

        }

        if (
            user.role !== ROLES.ADMIN &&
            enrollment.course.faculty.toString() !==
            user._id.toString()
        ) {

            throw new AppError(
                "You are not authorized to manage this enrollment",
                403
            );

        }

        if (
            enrollment.status !==
            ENROLLMENT_STATUS.ACTIVE
        ) {

            throw new AppError(
                "Only active enrollments can be removed",
                400
            );

        }

        enrollment.status =
            ENROLLMENT_STATUS.REMOVED;

        await enrollment.save();

        return enrollment;
    };
    

    /*
 * =========================================================
 * STUDENT — GET MY ENROLLMENTS
 * =========================================================
 *
 * Returns the courses in which the logged-in student
 * currently has an ACTIVE enrollment.
 */

export const getMyEnrollments = async ({
    studentId
}) => {

    const enrollments =
        await Enrollment.find({
            student: studentId,
            status: ENROLLMENT_STATUS.ACTIVE
        })
        .populate(
            "course",
            "name code description classroomCode status faculty"
        )
        .sort({
            createdAt: -1
        });

    return enrollments;
};


/*
 * =========================================================
 * STUDENT — GET MY ENROLLMENT REQUESTS
 * =========================================================
 *
 * Returns all enrollment requests made by the
 * logged-in student.
 *
 * This allows the Student Dashboard to show:
 *
 * PENDING
 * APPROVED / ACTIVE
 * REJECTED
 * REMOVED
 */

export const getMyEnrollmentRequests = async ({
    studentId
}) => {

    const enrollments =
        await Enrollment.find({
            student: studentId
        })
        .populate(
            "course",
            "name code description classroomCode status faculty"
        )
        .sort({
            createdAt: -1
        });

    return enrollments;
};


/*
 * =========================================================
 * FACULTY — GET COURSE ENROLLMENTS
 * =========================================================
 *
 * Returns ACTIVE students enrolled in a course.
 *
 * A faculty member can only access their own course.
 */

export const getCourseEnrollments = async ({
    courseId,
    user
}) => {

    const course =
        await findActiveCourse(courseId);


    /*
     * ADMIN can access any course.
     *
     * FACULTY can access only their own course.
     */

    if (
        user.role !== ROLES.ADMIN &&
        course.faculty.toString() !==
        user._id.toString()
    ) {

        throw new AppError(
            "You are not authorized to view this course",
            403
        );

    }


    const enrollments =
        await Enrollment.find({
            course: courseId,
            status: ENROLLMENT_STATUS.ACTIVE
        })
        .populate(
            "student",
            "name email role"
        )
        .sort({
            createdAt: -1
        });


    return enrollments;
};


/*
 * =========================================================
 * FACULTY — GET PENDING ENROLLMENT REQUESTS
 * =========================================================
 *
 * Returns pending student enrollment requests
 * for a particular course.
 */

export const getPendingEnrollments = async ({
    courseId,
    user
}) => {

    const course =
        await findActiveCourse(courseId);


    /*
     * ADMIN can access any course.
     *
     * FACULTY can access only their own course.
     */

    if (
        user.role !== ROLES.ADMIN &&
        course.faculty.toString() !==
        user._id.toString()
    ) {

        throw new AppError(
            "You are not authorized to view enrollment requests",
            403
        );

    }


    const enrollments =
        await Enrollment.find({
            course: courseId,
            status: ENROLLMENT_STATUS.PENDING
        })
        .populate(
            "student",
            "name email role"
        )
        .sort({
            requestedAt: 1
        });


    return enrollments;
};

export const previewBulkEnrollment = async ({
    courseId,
    fileBuffer
}) => {

    /*
     * ---------------------------------------------------------
     * Validate course
     * ---------------------------------------------------------
     */

    const course = await findActiveCourse(
        courseId
    );


    /*
     * ---------------------------------------------------------
     * Validate uploaded file
     * ---------------------------------------------------------
     */

    if (!fileBuffer) {

        throw new AppError(
            "Excel file is required",
            400
        );

    }


    /*
     * ---------------------------------------------------------
     * Read Excel workbook
     * ---------------------------------------------------------
     */

    let workbook;

    try {

        workbook = XLSX.read(
            fileBuffer,
            {
                type: "buffer"
            }
        );

    } catch (error) {

        throw new AppError(
            "Unable to read Excel file",
            400
        );

    }


    /*
     * ---------------------------------------------------------
     * Get first worksheet
     * ---------------------------------------------------------
     */

    const worksheetName =
        workbook.SheetNames[0];

    if (!worksheetName) {

        throw new AppError(
            "Excel file does not contain a worksheet",
            400
        );

    }

    const worksheet =
        workbook.Sheets[worksheetName];


    /*
     * ---------------------------------------------------------
     * Convert worksheet to JSON
     * ---------------------------------------------------------
     */

    const rows =
        XLSX.utils.sheet_to_json(
            worksheet,
            {
                defval: ""
            }
        );


    if (!rows.length) {

        throw new AppError(
            "Excel file does not contain any student records",
            400
        );

    }


    /*
     * ---------------------------------------------------------
     * Helper to read Excel columns safely
     *
     * This makes the import tolerant to:
     *
     * Name
     * name
     * NAME
     * Student Name
     * student name
     * StudentName
     * etc.
     * ---------------------------------------------------------
     */

    const getColumnValue = (
        row,
        possibleNames
    ) => {

        const rowKeys =
            Object.keys(row);

        for (
            const key of rowKeys
        ) {

            const normalizedKey =
                String(key)
                    .trim()
                    .toLowerCase()
                    .replace(
                        /[\s_-]+/g,
                        ""
                    );

            for (
                const possibleName
                of possibleNames
            ) {

                const normalizedPossibleName =
                    String(possibleName)
                        .trim()
                        .toLowerCase()
                        .replace(
                            /[\s_-]+/g,
                            ""
                        );

                if (
                    normalizedKey ===
                    normalizedPossibleName
                ) {

                    return row[key];

                }

            }

        }

        return "";

    };


    /*
     * ---------------------------------------------------------
     * Prepare preview result
     * ---------------------------------------------------------
     */

    const preview = [];

    const seenEmails = new Set();


    /*
     * ---------------------------------------------------------
     * Process every Excel row
     * ---------------------------------------------------------
     */

    for (
        let index = 0;
        index < rows.length;
        index++
    ) {

        const row = rows[index];

        const rowNumber =
            index + 2;


        /*
         * -----------------------------------------------------
         * Read Name
         * -----------------------------------------------------
         */

        const name =
            String(
                getColumnValue(
                    row,
                    [
                        "Name",
                        "Student Name",
                        "StudentName"
                    ]
                ) || ""
            ).trim();


        /*
         * -----------------------------------------------------
         * Read Email
         * -----------------------------------------------------
         */

        const email =
            String(
                getColumnValue(
                    row,
                    [
                        "Email",
                        "Student Email",
                        "StudentEmail"
                    ]
                ) || ""
            )
                .trim()
                .toLowerCase();


        /*
         * -----------------------------------------------------
         * Validate name
         * -----------------------------------------------------
         */

        if (!name) {

            preview.push({

                row: rowNumber,

                name,

                email,

                status: "FAILED",

                reason: "Name is required"

            });

            continue;

        }


        /*
         * -----------------------------------------------------
         * Validate email
         * -----------------------------------------------------
         */

        if (!email) {

            preview.push({

                row: rowNumber,

                name,

                email,

                status: "FAILED",

                reason: "Email is required"

            });

            continue;

        }


        /*
         * -----------------------------------------------------
         * Check duplicate email inside Excel
         * -----------------------------------------------------
         */

        if (seenEmails.has(email)) {

            preview.push({

                row: rowNumber,

                name,

                email,

                status: "FAILED",

                reason:
                    "Duplicate email in Excel"

            });

            continue;

        }

        seenEmails.add(email);


        /*
         * -----------------------------------------------------
         * Find student
         * -----------------------------------------------------
         */

        const student =
            await User.findOne({
                email,
                role: ROLES.STUDENT
            });


        if (!student) {

            preview.push({

                row: rowNumber,

                name,

                email,

                status: "FAILED",

                reason: "Student not found"

            });

            continue;

        }


        /*
         * -----------------------------------------------------
         * Check existing enrollment
         * -----------------------------------------------------
         */

        const enrollment =
            await Enrollment.findOne({
                student: student._id,
                course: course._id
            });


        /*
         * -----------------------------------------------------
         * No existing enrollment
         * -----------------------------------------------------
         */

        if (!enrollment) {

            preview.push({

                row: rowNumber,

                studentId: student._id,

                name: student.name,

                email: student.email,

                status: "READY",

                reason:
                    "Student can be enrolled"

            });

            continue;

        }


        /*
         * -----------------------------------------------------
         * Existing ACTIVE enrollment
         * -----------------------------------------------------
         */

        if (
            enrollment.status ===
            ENROLLMENT_STATUS.ACTIVE
        ) {

            preview.push({

                row: rowNumber,

                studentId: student._id,

                name: student.name,

                email: student.email,

                status: "SKIPPED",

                reason:
                    "Student is already enrolled"

            });

            continue;

        }


        /*
         * -----------------------------------------------------
         * Existing PENDING enrollment
         * -----------------------------------------------------
         */

        if (
            enrollment.status ===
            ENROLLMENT_STATUS.PENDING
        ) {

            preview.push({

                row: rowNumber,

                studentId: student._id,

                name: student.name,

                email: student.email,

                status: "SKIPPED",

                reason:
                    "Enrollment request is already pending"

            });

            continue;

        }


        /*
         * -----------------------------------------------------
         * Existing REJECTED enrollment
         * -----------------------------------------------------
         */

        if (
            enrollment.status ===
            ENROLLMENT_STATUS.REJECTED
        ) {

            preview.push({

                row: rowNumber,

                studentId: student._id,

                name: student.name,

                email: student.email,

                status: "SKIPPED",

                reason:
                    "Previous enrollment request was rejected"

            });

            continue;

        }


        /*
         * -----------------------------------------------------
         * Existing REMOVED enrollment
         * -----------------------------------------------------
         */

        if (
            enrollment.status ===
            ENROLLMENT_STATUS.REMOVED
        ) {

            preview.push({

                row: rowNumber,

                studentId: student._id,

                name: student.name,

                email: student.email,

                status: "READY",

                reason:
                    "Previously removed student can be reactivated"

            });

            continue;

        }

    }


    /*
     * ---------------------------------------------------------
     * Generate summary
     * ---------------------------------------------------------
     */

    const summary = {

        total: preview.length,

        ready: preview.filter(
            item =>
                item.status === "READY"
        ).length,

        skipped: preview.filter(
            item =>
                item.status === "SKIPPED"
        ).length,

        failed: preview.filter(
            item =>
                item.status === "FAILED"
        ).length

    };


    /*
     * ---------------------------------------------------------
     * Return preview
     * ---------------------------------------------------------
     */

    return {

        course: {

            _id: course._id,

            name: course.name,

            code: course.code

        },

        summary,

        students: preview

    };

};