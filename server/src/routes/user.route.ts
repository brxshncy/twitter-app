import express from "express";
import { protectedRoutes } from "../ middlewares/auth.middleware";
import {
    followUnfollowUser,
    getSuggestedUser,
    getUserProfile,
    updateUserProfile,
} from "../controllers/user.controller";
import { upload } from "../utils/multer";

const userRoutes = express.Router();

userRoutes.get("/profile/:id", protectedRoutes, getUserProfile);
userRoutes.get("/suggested", protectedRoutes, getSuggestedUser);
userRoutes.post("/follow-user/:id", protectedRoutes, followUnfollowUser);
userRoutes.put(
    "/edit-profile",
    protectedRoutes,
    upload.fields([
        { name: "profileImageUrl", maxCount: 1 },
        { name: "coverImageUrl", maxCount: 1 },
    ]),
    updateUserProfile
);

export default userRoutes;
