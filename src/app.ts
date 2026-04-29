import express from "express";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import authRoutes from "./routes/auth.routes";

export const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.get("/", (req, res) => {
    res.json({message: "api corriendo..."})
})
