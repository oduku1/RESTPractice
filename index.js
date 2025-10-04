import express from "express";
import commentRoutes from "./routes/commentRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Middleware so req.body works!
app.use(express.json());

app.use("/api/comments", commentRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/users", userRoutes);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});