require("dotenv").config();
import { prisma } from './util/prisma';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { authRoutes } from './routes/auth';
import { otpRoutes } from './routes/otp';
import { otpFieldRoutes } from './routes/otpField';
import { sessionMiddleware } from './middleware/session';
import passport from 'passport';
import { InitStrategies } from './auth/Strategies';
import { accountRoutes } from './routes/account';

(async () => {
    const server = express();
    
    // Add middlewares
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    server.use(sessionMiddleware);
    server.use(passport.initialize());
    server.use(passport.session());

    server.set('trust proxy', 1); // trust proxy in production.
    server.use(cors({
        origin: ["http://localhost:3000", (process.env.WEB_URL || "http://localhost:3001")],
        credentials: true
    }));

    // Load passport strategies
    InitStrategies();

    server.post("/", (_: Request, res: Response) => res.send({ ok: true }));

    // All the route handlers.
    server.use("/auth", authRoutes);
    server.use("/account", accountRoutes);
    server.use("/otp", otpRoutes);
    server.use("/fields", otpFieldRoutes);
    
    // Start listening
    const port = process.env.PORT || 8080;
    server.listen(port, () => console.log(`Server running on http://localhost:${port}`))
})().finally(() => {
    prisma.$disconnect();
});