import { NextFunction, Request, Response } from "express";

export const isGuest = (req: Request, res: Response, next: NextFunction) => {

    if (req.user) {
        return res.status(403).send({
            param: "session",
            msg: "You are already logged in"
        });
    }

    return next();
}