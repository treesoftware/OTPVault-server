import { Router } from "express";
import { body } from "express-validator";
import { validateErrors } from "../middleware/validateErrors";
import { isAuth } from '../middleware/isAuth';
import { createSingleOtp, deleteSingleOtp, findSingleOtp, listOtps, updateSingleOtp } from "../controllers/otps";

export const otpRoutes = Router();

otpRoutes.get(
    "/",
    isAuth,
    listOtps
);

otpRoutes.get(
    "/:id",
    isAuth,
    findSingleOtp
);

otpRoutes.post(
    "/",
    isAuth,
    body("name")
        .isString()
        .withMessage("Please enter a valid password name"),
    body("key")
        .isString()
        .withMessage("Please enter a valid secret key"),
    body("issuer")
        .optional()
        .isString()
        .withMessage("Please enter a valid key issuer"),
    body("algorithm")
        .optional()
        .isString()
        .withMessage("Please enter a valid key algorithm"),
    body("digits")
        .optional()
        .isString()
        .withMessage("Please enter a valid amount of digits to generate"),
    body("period")
        .optional()
        .isString()
        .withMessage("Please enter a valid code duration time"),
    body("fields")
        .optional()
        .isArray()
        .withMessage("Please enter a valid fields list"),
    body("fields.*.name")
        .isString()
        .withMessage("Please enter a valid field name"),
    body("fields.*.value")
        .isString()
        .withMessage("Please enter a valid field value"),
    validateErrors,
    createSingleOtp
);

otpRoutes.put(
    "/:id",
    isAuth,
    body("name")
        .isString()
        .withMessage("Please enter a valid password name"),
    body("key")
        .isString()
        .withMessage("Please enter a valid secret key"),
    validateErrors,
    updateSingleOtp
);

otpRoutes.delete(
    "/:id",
    isAuth,
    deleteSingleOtp
);