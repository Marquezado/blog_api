import { Router } from "express";
import * as postController from "../controllers/post.controller";
import { authMiddleware } from "../middlewares/middleware";

const router = Router();
router.use(authMiddleware);

router.post("/", postController.createPost)
router.get("/", postController.getAllPosts)
router.get("/:id", postController.getPostById)
router.put("/:id", postController.updatePost)
router.delete("/:id", postController.deletePost)

export default router;