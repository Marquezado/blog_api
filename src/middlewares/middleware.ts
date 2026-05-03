import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma"
import { JwtPayload } from "../types/jwt";


const JWT_SECRET = process.env.JWT_SECRET!;

export const authMiddleware = async ( req: Request, res: Response, next: NextFunction ) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({error: "No token provided"})
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        const user = await prisma.user.findUnique({
            where: {id : decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                deletedAt: true,
            },
        });

        if (!user || user.deletedAt !== null) {
            return res.status(401).json({ error: "User not found"})
        }

        req.user = {
            userId: user.id,
        };

        req.currentUser = {
            ...user,
            name: user.name ?? "unnamed"
        };

        next();
    } catch {
        return res.status(401).json({ error: "Invalid token"})
    }
}