import { prisma } from "../lib/prisma";
import { Request, Response } from "express";


// create a user
/* export const createUser = async (req: Request, res: Response) => {
    try {
        const {name, email } = req.body;

        const user = await prisma.user.create({
            data: {
                name,
                email,
            },
        });
        return res.status(201).json({message: "User created succesfully", data: user});

    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(400).json({ error: "Email already exists!"});
        }
        return res.status(500).json({ error: "Error create User"})
    }
};
 */

// get all users
export const getUsers = async (_req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                deletedAt: null,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        return res.json(users)
    } catch {
        return res.status(500).json({ error: "Error getting users"});
    }
}

// get a user
export const getUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({error: "Invalid user id"})
        }

        const user = await prisma.user.findUnique({
            where: { 
                id,
             },
             select: {
                id: true,
                email: true,
                name: true,
                deletedAt: true,
             }
        });

        if (!user || user.deletedAt !== null) {
            return res.status(404).json({ error : "User not found"});
        }
        const { deletedAt, ...safeUser} = user;
        return res.json(safeUser);
    } catch {
        return res.status(500).json({ error: "Error getting user"})
    }
}

// get a user with your posts
export const getUserWithPosts = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                deletedAt: true,
                posts: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        published: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        return res.json(user);
    } catch {
        return res.status(500).json({error: "Error getting user with your posts"});
    }
}

// update user
export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name, email } = req.body;

        const user = await prisma.user.update({
            where: {
                id,
                deletedAt: null,
            },
            data: { name, email},
        });
        return res.json(user);
    } catch (error: any) {
        if (error.code === "P2025") {
            return res.status(404).json({error: "User not found"});
        }

        if (error.code === "P2002") {
            return res.status(400).json({error: "Email already exists"});
        }
        return res.status(500).json({error: "Error updating User"});
    }
}

// soft delete user 
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const user = await prisma.user.update({
            where: {
                id,
                deletedAt: null,
            },
            data: {
                deletedAt: new Date(),
            },
        });

        return res.json({
            message: "User marked as deleted",
            user,
        });
    } catch (error: any) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "User not found"});
        }
        console.log(error);
        return res.status(500).json({ error: "Error deleting user"});
    }
}