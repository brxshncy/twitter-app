import express from "express";
import {
  getMe,
  loginUser,
  logout,
  registerUser,
} from "../controllers/auth.controller";
import { authRegisterValidator } from "../validation/auth.validator";
import { protectedRoute } from "../middleware/auth.middleware";

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/register", authRegisterValidator, registerUser);
authRouter.get("/me", protectedRoute, getMe);
authRouter.get("/logout", logout);

export default authRouter;
