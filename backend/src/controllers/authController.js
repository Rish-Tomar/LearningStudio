import User from "../models/Users.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            token: generateToken(user._id, user.role),
            user
        }
    });

});

export const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {

        res.status(401);

        throw new Error("Invalid email or password");

    }

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            token: generateToken(user._id, user.role),
            user
        }
    });

});

export const getProfile = asyncHandler(async (req, res) => {

    res.status(200).json({
        success: true,
        data: req.user
    });

});