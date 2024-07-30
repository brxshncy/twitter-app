import express from "express";
import {
  getSuggestedUsers,
  getUserProfile,
  toggleFollowUser,
  updateUserProfile,
} from "../controllers/user.controller";
import { protectedRoute } from "./../middleware/auth.middleware";
import { upload } from "../utils/multer";

const userRoutes = express.Router();

userRoutes.get("/profile/:id", protectedRoute, getUserProfile);
userRoutes.get("/suggested", protectedRoute, getSuggestedUsers);
userRoutes.post("/follow/:id", protectedRoute, toggleFollowUser);
userRoutes.put(
  "/update",
  protectedRoute,
  upload.fields([
    { name: "profileImageUrl", maxCount: 1 },
    { name: "coverImageUrl", maxCount: 1 },
  ]),
  //@ts-ignore
  updateUserProfile
);

export default userRoutes;
