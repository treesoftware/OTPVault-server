import passport from "passport";
import { prisma } from "../util/prisma";
import { InitLocalAuthStrategy } from "./Local";

export const InitStrategies = () => {
    InitLocalAuthStrategy();

    passport.serializeUser((user: any, done) => {
        done(null, (user).id);
    });

    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    id: id
                }
            });
            if (!user) {
                return done("User not found");
            }
            return done(null, user);
        } catch (e) {
            return done(e);
        }
    })
};