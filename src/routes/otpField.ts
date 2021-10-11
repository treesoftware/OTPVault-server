import { Router } from "express";
import { body } from "express-validator";
import { validateErrors } from "../middleware/validateErrors";
import { isAuth } from '../middleware/isAuth';
import { createSingleOtpField, deleteSingleOtpField, updateSingleOtpField } from "../controllers/otpfield";

export const otpFieldRoutes = Router();

otpFieldRoutes.post(
    "/:otp_id",
    isAuth,
    body("name")
        .isString()
        .withMessage("Please enter a valid field name"),
    body("value")
        .isString()
        .withMessage("Please enter a valid field value"),
    validateErrors,
    createSingleOtpField
);

otpFieldRoutes.put(
    "/:otp_id/:id",
    isAuth,
    body("name")
        .isString()
        .withMessage("Please enter a valid field name"),
    body("value")
        .isString()
        .withMessage("Please enter a valid field value"),
    validateErrors,
    updateSingleOtpField
);

otpFieldRoutes.delete(
    "/:otp_id/:id",
    isAuth,
    deleteSingleOtpField
);