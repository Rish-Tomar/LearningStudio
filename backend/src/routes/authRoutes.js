console.log("Auth Routes Loaded");
import express from "express";
import {
    registerUser,
    loginUser,
    getProfile
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
    "/profile",
    protect,
    getProfile
);


router.post("/register", registerUser);

router.post("/login", loginUser);

// router.post("/login", (req, res) => {
//     console.log(" hit");
//     res.json({
//         message: "login Route Working"
//     });
// });

// router.get("/profile", (req, res) => {
//     console.log("Profile hit");
//     res.json({
//         message: "Profile Route Working"
//     });
// });


export default router;