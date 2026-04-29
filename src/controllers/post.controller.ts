import { prisma } from "../lib/prisma";
import { Request, Response } from "express";


// create a post
export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content, authorId} = req.body;

        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId,
            },
        });

        return res.status(201).json(post);
    } catch {
        return res.status(500).json({error: "Error creating post"});
    }
};

// get all posts
export const getAllPosts = async (_req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: true
            },
        });

        return res.json(posts);
    } catch {
        return res.status(500).json({error: "Error getting posts"});
    }
}

// get a post by id
export const getPostById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const post = await prisma.post.findUnique({
            where: {id},
            include: { author: true},
        });
        
        if (!post) {
            return res.status(404).json({error: "Post not found"});
        }

        return res.json(post);
    } catch {
        return res.status(500).json({error: "Error getting post"});
    }
}

// update post
export const updatePost = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { title, content, published } = req.body;
        
        const post = await prisma.post.update({
            where: {id},
            data: {
                title,
                content,
                published,
            },
        });

        return res.json(post)
    } catch (error: any) {
        if (error.code === "P2025") {
            return res.status(404).json({error: "Post not found"});
        }
        return res.status(500).json({error: "Error updating post"});
    }
}

// physical deletion of posts
export const deletePost = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await prisma.post.delete({
            where: {id},
        });

        return res.json({message: "Post deleted"});
    } catch (error: any) {
        if (error.code === "P2025") {
            return res.status(404).json({error: "Post not found"});
        }
        return res.status(500).json({error: "Error deleting post"});
    }
}
