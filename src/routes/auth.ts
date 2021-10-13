import { Router } from "express";
import { body } from "express-validator";
import { GetUser, localLogin, SignOut, SignUp } from "../controllers/auth";
import { validateErrors } from "../middleware/validateErrors";
import { prisma } from "../util/prisma";
import { isGuest } from '../middleware/isGuest';
import { isAuth } from '../middleware/isAuth';

export const authRoutes = Router();

authRoutes.get("/", isAuth, GetUser);

authRoutes.post(
    "/signup",
    isGuest,
    body("email")
        .trim()
        .isString()
        .isEmail()
        .withMessage("Please enter a valid email address")
        .custom((input) => {
            return new Promise(async (resolve, reject) => {

                try {
                    const user = await prisma.user.findFirst({
                        where: {
                            email: input
                        }
                    });
                    if (user) {
                        reject(new Error("You already have an account with this email."));
                    } else {
                        resolve(true);
                    }
                } catch (e) {
                    console.error(e);
                    reject(new Error("Failed to verify your email address"));
                }

            });
        }),
    body("name")
        .optional()
        .trim()
        .isString()
        .withMessage("Please enter a valid name."),
    body("password")
        .isString()
        .withMessage("Please enter a valid password")
        .isStrongPassword({
            minLength: 10,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
        })
        .withMessage("Passwords must be at least 10 characters long and contain 1 uppercase, 1 lowercase, 1 number and 1 symbol."),
    body("confirmPassword")
        .isString()
        .withMessage("Please confirm your password")
        .isStrongPassword({
            minLength: 10,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
        })
        .withMessage("The password's don't match.")
        .custom((input, { req }) => {
            return new Promise(async (resolve, reject) => {

                if(input !== req.body.password) {
                    reject(new Error("The password's do not match."));
                } else {
                    resolve(true);
                }

            });
        }),
    validateErrors,
    SignUp
);

authRoutes.post(
    "/login",
    isGuest,
    body("email")
        .isString()
        .isEmail()
        .withMessage("Please enter a valid email address."),
    body("password")
        .isString()
        .withMessage("Please enter a valid password")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 0,
            minUppercase: 1
        })
        .withMessage("Please enter a valid password"),
    validateErrors,
    localLogin
);

authRoutes.post(
    "/logout",
    isAuth,
    SignOut
)