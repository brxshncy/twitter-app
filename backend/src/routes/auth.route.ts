import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";
import { authRegisterValidator } from "../validation/auth.validator";

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/register", authRegisterValidator, registerUser);

export default authRouter;
