import express from "express";
import { protectedRoutes } from "../ middlewares/auth.middleware";
import {
    followUnfollowUser,
    getSuggestedUser,
    getUserProfile,
} from "../controllers/user.controller";

const userRoutes = express.Router();

userRoutes.get("/profile/:id", protectedRoutes, getUserProfile);
userRoutes.get("/suggested", protectedRoutes, getSuggestedUser);
userRoutes.post("/follow-user/:id", protectedRoutes, followUnfollowUser);

export default userRoutes;
