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

(async () => {
    const server = express();
    
    // Add middlewares
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    server.use(sessionMiddleware);
    server.use(passport.initialize());
    server.use(passport.session());

    server.use(cors({
        origin: ["http://localhost:3000"],
        credentials: true
    }));

    // Load passport strategies
    InitStrategies();

    server.post("/", (_: Request, res: Response) => res.send({ ok: true }));

    // All the route handlers.
    server.use("/auth", authRoutes);
    server.use("/otp", otpRoutes);
    server.use("/fields", otpFieldRoutes);
    
    // Start listening
    const port = process.env.PORT || 8080;
    server.listen(port, () => console.log(`Server running on http://localhost:${port}`))
})().finally(() => {
    prisma.$disconnect();
});