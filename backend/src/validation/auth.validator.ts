import { body } from "express-validator";
import { handleValidationErrors } from "./validationHandler";

export const authRegisterValidator = [
  body("email").notEmpty().withMessage("Email is required"),
  body("username").notEmpty().withMessage("Username is required"),
  body("name").notEmpty().withMessage("Name is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];
