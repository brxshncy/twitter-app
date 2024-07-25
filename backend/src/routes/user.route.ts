import express from "express";
import {
  getSuggestedUsers,
  getUserProfile,
  toggleFollowUser,
  updateUserProfile,
} from "../controllers/user.controller";
import { protectedRoute } from "./../middleware/auth.middleware";

const userRoutes = express.Router();

userRoutes.get("/profile/:username", protectedRoute, getUserProfile);
userRoutes.get("/suggested", protectedRoute, getSuggestedUsers);
userRoutes.post("/follow/:id", protectedRoute, toggleFollowUser);
userRoutes.post("/update", protectedRoute, updateUserProfile);

export default userRoutes;
