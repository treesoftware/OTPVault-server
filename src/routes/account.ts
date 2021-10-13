import { Router } from "express";
import { body } from "express-validator";
import { validateErrors } from "../middleware/validateErrors";
import { prisma } from "../util/prisma";
import { isAuth } from '../middleware/isAuth';
import { DeleteAccount, UpdateAccount, UpdatePassword } from "../controllers/account";

export const accountRoutes = Router();

accountRoutes.post(
    "/",
    isAuth,
    body("name")
        .optional()
        .isString()
        .withMessage("Please enter a valid name."),
    body("email")
        .isString()
        .withMessage("Please enter a valid email address")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .custom((input, { req }) => {
            return new Promise(async (resolve, reject) => {

                try {
                    const user = await prisma.user.findFirst({
                        where: {
                            email: input,
                            NOT: {
                                id: req.user.id
                            }
                        }
                    });
                    if (user) {
                        reject(new Error("There is already an account with this email."));
                    } else {
                        resolve(true);
                    }
                } catch (e) {
                    reject(new Error("Failed to verify your email address"));
                }

            });
        }),
    validateErrors,
    UpdateAccount
);
accountRoutes.post(
    "/password",
    isAuth,
    body("current_password")
        .isString()
        .withMessage("Please enter your current password."),
    body("new_password")
        .isString()
        .isStrongPassword({
            minLength: 10,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
        })
        .withMessage("Passwords must be at least 10 characters long and contain 1 uppercase, 1 lowercase, 1 number and 1 symbol.")
        .custom((input, { req }) => {
            return new Promise(async (resolve, reject) => {

                if(input === req.body.new_password_confirmed) {
                    resolve(true);
                } else {
                    reject(new Error("Your password's don't match."));
                }

            });
        }),
    body("key")
        .isString()
        .withMessage("You need to provide a new, encrypted, version of your secret key to continue to use your vault."),
    validateErrors,
    UpdatePassword
);

accountRoutes.delete(
    "/",
    isAuth,
    body("password")
        .isString()
        .withMessage("Please your password."),
    validateErrors,
    DeleteAccount
);