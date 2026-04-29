import { prisma } from "../lib/prisma";
import { Request, Response } from "express"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const SALT_ROUNDS = Number(process.env.ROUNDED);

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({message: "User created", data: user,});
    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(400).json({error: "Email already exists"});
        }
        console.log(error)
        return res.status(500).json({ error: "Error registering user"})
    }
    
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({error: "Invalid credentials"});
        }

        const token = jwt.sign({
            userId: user.id,
            email: user.email,
        },
        JWT_SECRET,
            { expiresIn: "1d"}
        );

        return res.json({
            message: "Login successful",
            token,
        });

    } catch {
        return res.status(500).json({error: "Login error"})
    }
}