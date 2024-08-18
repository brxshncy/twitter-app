import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";
import { authRegisterValidator } from "../validators/auth.validator";

const authRoute = express.Router();

authRoute.route("/login").post(loginUser);
authRoute.route("/register").post(authRegisterValidator, registerUser);

export default authRoute;
