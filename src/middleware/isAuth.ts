import { NextFunction, Request, Response } from "express";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(403).send({
            param: "session",
            msg: "You are not logged in"
        });
    }

    return next();
}