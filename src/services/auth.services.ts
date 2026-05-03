import { prisma } from "../lib/prisma";
import { Request, Response } from "express"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET!;
const SALT_ROUNDS = Number(process.env.ROUNDED);

const registerUser = z.object({
    name: z.string().min(2, "Name must have at least 2 characters").max(20, "Name must have at most 20 characters"),
    email: z.email("Invalid email").max(55, "Email must have at most 55 characters"),
    password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password must be at most 128 characteres"),
    role: z.enum(["USER", "ADMIN"]),
})

export const register = async (req: Request, res: Response) => {
    try {

        const parsed = registerUser.safeParse(req.body)

        if(!parsed.success){
            return res.status(400).json({
                errros: parsed.error.format(),
            });
        }

        const { name, email, password, role } = parsed.data;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
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