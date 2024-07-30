import { body } from "express-validator";
import { handleValidationErrors } from "./validationHandler";

export const postValidator = [
  body("text").notEmpty().withMessage("Post cannot be empty!"),
  handleValidationErrors,
];
