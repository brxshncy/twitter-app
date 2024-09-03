import express from "express";
import { getMe, loginUser, registerUser } from "../controllers/auth.controller";
import { authRegisterValidator } from "../validators/auth.validator";
import { protectedRoutes } from "../ middlewares/auth.middleware";

const authRoute = express.Router();

authRoute.route("/login").post(loginUser);
authRoute.route("/register").post(authRegisterValidator, registerUser);
authRoute.route("/me").get(protectedRoutes, getMe);

export default authRoute;
