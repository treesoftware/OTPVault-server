import { prisma } from "../util/prisma";
import { Request, Response } from "express";
import { OTPField } from "../@types/OTPField";

export const listOtps = async (req: Request, res: Response) => {

    try {
        const otps = await prisma.oneTimePassword.findMany({
            where: {
                user_id: (req.user as any).id
            },
            include: {
                fields: true
            }
        });
    
        return res.send(otps);
    } catch (e) {
        return res.status(500).send({
            param: "server",
            msg: "Failed to fetch passwords"
        })
    }

}
export const findSingleOtp = async (req: Request, res: Response) => {

    try {
        const otps = await prisma.oneTimePassword.findFirst({
            where: {
                id: req.params.id,
                user_id: (req.user as any).id
            },
            include: {
                fields: true
            }
        });
    
        return res.send(otps);
    } catch (e) {
        return res.status(500).send({
            param: "server",
            msg: "Failed to fetch password"
        })
    }

}
export const createSingleOtp = async (req: Request, res: Response) => {

    try {

        const fields = (req.body.fields as OTPField[]);

        const otp = await prisma.oneTimePassword.create({
            data: {
                user_id: (req.user as any).id,
                name: req.body.name,
                key: req.body.key,
                issuer: req.body.issuer,
                algorithm: req.body.algorithm,
                digits: req.body.digits,
                period: req.body.period,
                fields: {
                    createMany: {
                        data: fields
                    }
                }
            }
        });
    
        return res.send(otp);
    } catch (e) {
        return res.status(500).send({
            param: "server",
            msg: "Failed to fetch password"
        })
    }

}
export const createMassOtp = async (req: Request, res: Response) => {

    try {

        const keys = (req.body.keys as { name: string, key: string, issuer: string, algorithm?: string; }[]);

        await prisma.oneTimePassword.createMany({
            data: keys.map(key => ({
                user_id: (req.user as any).id,
                name: key.name,
                issuer: key.issuer,
                algorithm: key.algorithm,
                key: key.key
            }))
        });
    
        return res.send({ ok: true });
    } catch (e) {
        return res.status(500).send({
            param: "server",
            msg: "Failed to fetch password"
        })
    }

}
export const updateSingleOtp = async (req: Request, res: Response) => {

    try {
        const otp = await prisma.oneTimePassword.findFirst({
            where: {
                id: req.params.id,
                user: req.user,
            }
        });

        if(!otp) {
            return res.status(404).send({
                param: "id",
                msg: "Failed to find one time password"
            });
        }


        await prisma.oneTimePassword.update({
            where: {
                id: otp.id
            },
            data: {
                name: req.body.name,
                key: req.body.key,
                issuer: req.body.issuer,
                algorithm: req.body.algorithm,
                digits: req.body.digits,
                period: req.body.period,
                updatedAt: new Date(),
            }
        })

        return res.send({ ok: true });

    } catch (e) {
        return res.status(500).send({
            param: "server",
            msg: "Failed to fetch password"
        })
    }

}
export const deleteSingleOtp = async (req: Request, res: Response) => {

    try {
        const otp = await prisma.oneTimePassword.findFirst({
            where: {
                id: req.params.id,
                user: req.user,
            }
        });

        if(!otp) {
            return res.status(404).send({
                param: "id",
                msg: "Failed to find one time password"
            });
        }


        await prisma.oneTimePassword.delete({
            where: {
                id: otp.id
            }
        });

        return res.send({ ok: true });

    } catch (e) {
        return res.status(500).send({
            param: "server",
            msg: "Failed to fetch password"
        })
    }

}