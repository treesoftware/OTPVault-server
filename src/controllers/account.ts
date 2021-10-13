import { User } from ".prisma/client";
import { compare, hash } from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../util/prisma";

export const UpdateAccount = async (req: Request, res: Response) => {

    try {

        const theUser = (req.user as User);

        await prisma.user.update({
            where: {
                id: theUser.id
            },
            data: {
                name: req.body.name,
                email: req.body.email
            }
        });

        return res.status(200).send({ ok: true });

    } catch (e) {
        return res.status(500).send({
            param: "server",
            msg: "Failed to update your account settings."
        })
    }

};
export const UpdatePassword = async (req: Request, res: Response) => {

    try {

        const theUser = (req.user as User);
        const identityConfirmed = await compare(req.body.current_password, theUser.password);
        if(!identityConfirmed) {
            return res.status(403).send({
                param: "password",
                msg: "Could not change your password because your current password was incorrect."
            })
        }

        const pass_hash = await hash(req.body.password, 12); // Hash user's password

        await prisma.user.update({
            where: {
                id: theUser.id
            },
            data: {
                password: pass_hash,
                key: req.body.key
            }
        });

        return res.status(200).send({ ok: true });

    } catch (e) {
        return res.status(500).send({
            param: "server",
            msg: "Failed to update your account settings."
        })
    }

};

export const DeleteAccount = async (req: Request, res: Response) => {
    try {

        const theUser = (req.user as User);

        const identityConfirmed = await compare(req.body.password, theUser.password);
        if(!identityConfirmed) {
            return res.status(403).send({
                param: "password",
                msg: "Could not delete your account because your password was incorrect."
            })
        }

        // Log the user out before deleting the account.
        req.logout();

        await prisma.user.delete({
            where: {
                id: theUser.id
            }
        });

        return res.status(200).send({ ok: true });

    } catch (e) {
        return res.status(500).send({
            param: "server",
            msg: "Failed to update your account settings."
        })
    } 
}