import { body } from "express-validator";
import { handleValidationErrors } from "./validatorUtil";

export const tweetValidator = [
    body("tweet").notEmpty().withMessage("Tweet cannot be empty"),
    handleValidationErrors,
];
