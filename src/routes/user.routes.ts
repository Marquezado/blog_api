import { Router } from "express";
import * as userController from "../controllers/user.controller"
import { authMiddleware } from "../middlewares/middleware";

const router = Router();
router.use(authMiddleware);

// router.post("/", userController.createUser)
router.get("/", userController.getUsers)
router.get("/", userController.getUser)
router.get("/:id", userController.getUserWithPosts)
router.put("/:id", userController.updateUser)
router.delete("/:id", userController.deleteUser)

export default router;