import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  toggleTask,
  updateTask
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTasks).post(createTask);
router.route("/:id").get(getTask).put(updateTask).delete(deleteTask);
router.patch("/:id/toggle", toggleTask);

export default router;
