import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_KEY = process.env.JWT_KEY as string;

export function isAuthorize(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    const token = authHeader.split("Bearer ")[1];

    try {
        const isCorrect = jwt.verify(token, JWT_KEY);
        if (isCorrect) {
            return next();
        }
    } catch (error) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    return res.status(403).json({ message: "Unauthorized" });
}
