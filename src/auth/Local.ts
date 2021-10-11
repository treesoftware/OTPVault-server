import passport from "passport";
import { Strategy } from 'passport-local';
import { compare } from 'bcrypt';
import { prisma } from "../util/prisma";

export const InitLocalAuthStrategy = () => {
    passport.use(GetStrategy());
}

const GetStrategy = (): Strategy => {
    return new Strategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        async (email: any, password: any, done: any) => {
            try {
                const user = await prisma.user.findFirst({
                    where: {
                        email
                    }
                });
                if (!user) {
                    return done(null, false, { message: 'Invalid email or password.' });
                }
                const passVerify = await compare(password, user.password);
                if (!passVerify) {
                    return done(null, false, { message: 'Invalid email or password.' });
                }

                return done(null, user);
            } catch (e) {
                console.error(e);
                return done(null, false, { message: "Failed to verify email and password, please try again." });
            }
        })
};