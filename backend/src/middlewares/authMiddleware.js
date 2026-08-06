import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            res.status(401);
            throw new Error("User not found");
        }

        return next();
    }

    res.status(401);
    throw new Error("Not authorized. Token missing.");

});

export const authorize = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {

            res.status(403);

            throw new Error("Access denied");

        }

        next();

    };

};
export const facultyOnly = authorize(
    "FACULTY",
    "ADMIN"
);