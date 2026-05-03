import { Router } from "express";
import * as postController from "../controllers/post.controller";
import { authMiddleware } from "../middlewares/middleware";

const router = Router();
router.use(authMiddleware);

router.post("/", postController.createPost) // create post
router.get("/", postController.getAllPosts) // get all posts
router.get("/me", postController.getAllMyPosts) // get all my posts
router.get("/:id", postController.getPostById) // get post by id
router.put("/:id", postController.updatePost) // udpate post by id
router.delete("/:id", postController.deletePost) // delete post by id

export default router;