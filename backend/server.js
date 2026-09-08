import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Task Manager API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
