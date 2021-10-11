import { AES, HmacSHA256, SHA256, enc } from "crypto-js";
import { NextFunction, Request, Response } from "express";
import { makeKey } from '../util/makeKey';
import { prisma } from "../util/prisma";
import { hash } from 'bcrypt';
import passport from "passport";
import { User } from ".prisma/client";

export const GetUser = (req: Request, res: Response) => {
    return OnSignIn(req.user as User, req, res);
}

export const SignUp = async (req: Request, res: Response) => {

    const otpKeyString = makeKey(128); // Generate a key to encrypt our passwords with
    const otpDecryptKey = `${req.body.password}`; // Use our password to encrypt the password's master password with
    
    const pass_hash = await hash(req.body.password, 12); // Hash user's password
    

    const encryptedKey = AES.encrypt(otpKeyString, otpDecryptKey).toString(); // Encrypt master password
    const hmac = HmacSHA256(encryptedKey, SHA256(otpDecryptKey)).toString(); // Generate master password HMAC


    try {
        await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: pass_hash,
                key: hmac + encryptedKey
            }
        });
        return res.send({ ok: true });

} catch (e) {
        return res.status(500).send({
            param: "server",
            msg: "Failed to create account, please try again."
        })
    }


}

// The function that sends the ok login response from however they've logged in!
const OnSignIn = async (user: User, _: Request, res: Response) => {

    return res.send({
        ok: true,
        user: {
            name: user.name,
            email: user.email,
            verified: user.emailVerified,
            
            key: user.key,

            createdDate: user.createdAt,
        }
    })

};

export const localLogin = (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate("local", (err, user) => {
        if (err) {
            return res.status(500).send({
                param: "server", 
                msg: "Failed to verify your email or password"
            })
        }

        if (!user) {
            return res.status(400).send({
                param: "email", 
                msg: "Invalid email or password"
            })
        }

        return req.logIn(user, (err) => {

            if (err) {
                console.error(err);
                return res.status(400).send({
                    param: "email", 
                    msg: "Invalid email or password"
                })
            }

            return OnSignIn(user, req, res);
        });
    })(req, res, next);

};