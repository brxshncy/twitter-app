import { body } from "express-validator";
import { handleValidationErrors } from "./validatorUtil";

export const commentTweetValidator = [
    body("comment").notEmpty().withMessage("Comment should contain text"),
    handleValidationErrors,
];
