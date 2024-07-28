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
userRoutes.post(
  "/update",
  protectedRoute,
  upload.single("profileImageUrl"),
  upload.single("coverImageUrl"),
  updateUserProfile
);

export default userRoutes;
