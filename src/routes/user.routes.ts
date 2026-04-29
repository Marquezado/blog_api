import { Router } from "express";
import * as userController from "../controllers/user.controller"
import { authMiddleware } from "../middlewares/middleware";

const router = Router();
router.use(authMiddleware);

// router.post("/", userController.createUser) now we use register
router.get("/", userController.getUsers) // get all users
router.get("/:id", userController.getUser) // get a user by id
router.get("/post/:id", userController.getUserWithPosts) // get posts by id user
router.put("/:id", userController.updateUser) // update user by id
router.delete("/:id", userController.deleteUser) // delete by id user

export default router;