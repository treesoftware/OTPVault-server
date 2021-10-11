import { prisma } from "../util/prisma";
import { Request, Response } from "express";
import { OneTimePassword } from ".prisma/client";

export const createSingleOtpField = async (req: Request, res: Response) => {

    try {
        const otp = await findOTP(req.params.otp_id, (req.user as any).id, res);
        if(otp === false) {
            return;
        }

        const otpField = await prisma.oneTimePasswordField.create({
            data: {
                otp_id: (otp as OneTimePassword).id,
                name: req.params.name,
                value: req.params.value
            }
        });
    
        return res.send(otpField);
    } catch (e) {
        return res.status(500).send({
            param: "server",
            msg: "Failed to create password field"
        })
    }

}
export const updateSingleOtpField = async (req: Request, res: Response) => {

    try {

        const otp = await findOTP(req.params.otp_id, (req.user as any).id, res);
        if(otp === false) {
            return;
        }

        const otpField = await prisma.oneTimePasswordField.findFirst({
            where: {
                id: (req.params as any).id,
                otp_id: (otp as OneTimePassword).id
            }
        });
        if(!otpField) {
            return res.status(404).send({
                param: "id",
                msg: "Field not found."
            })
        }

        await prisma.oneTimePasswordField.update({
            where: {
                id: otpField.id
            },
            data: {
                name: req.body.name,
                value: req.body.value,
            }
        })

        return res.send({ ok: true });

    } catch (e) {
        return res.status(500).send({
            param: "server",
            msg: "Failed to fetch password field"
        })
    }

}
export const deleteSingleOtpField = async (req: Request, res: Response) => {

    try {

        const otp = await findOTP(req.params.otp_id, (req.user as any).id, res);
        if(otp === false) {
            return;
        }

        const otpField = await prisma.oneTimePasswordField.findFirst({
            where: {
                id: (req.params as any).id,
                otp_id: (otp as OneTimePassword).id
            }
        });
        if(!otpField) {
            return res.status(404).send({
                param: "id",
                msg: "Field not found."
            })
        }

        await prisma.oneTimePasswordField.delete({
            where: {
                id: otpField.id
            }
        })

        return res.send({ ok: true });

    } catch (e) {
        return res.status(500).send({
            param: "server",
            msg: "Failed to fetch password field"
        })
    }

}

const findOTP = async (id: string, user_id: number, res: Response): Promise<OneTimePassword | Boolean> => {
    try {
        const otp = await prisma.oneTimePassword.findFirst({
            where: {
                id,
                user_id,
            }
        });
    
        if(!otp) {
            res.status(404).send({
                param: "id",
                msg: "Failed to find one time password"
            });
            return false;
        }
    
        return otp;
    } catch (e) {
        res.status(500).send({
            param: "server",
            msg: "Failed to find password."
        });
        return false;
    }
}