import mongoose from "mongoose";
import Task from "../models/Task.js";

const validateTaskInput = (body) => {
  const { title, description, status, priority, dueDate } = body;

  if (title !== undefined && !title.trim()) {
    return "Title cannot be empty.";
  }

  if (status !== undefined && !["pending", "completed"].includes(status)) {
    return "Invalid status.";
  }

  if (priority !== undefined && !["low", "medium", "high"].includes(priority)) {
    return "Invalid priority.";
  }

  if (dueDate && Number.isNaN(Date.parse(dueDate))) {
    return "Invalid due date.";
  }

  return null;
};

export const getTasks = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = { user: req.user._id };

    if (status && ["pending", "completed"].includes(status)) {
      filter.status = status;
    }

    if (search?.trim()) {
      filter.title = { $regex: search.trim(), $options: "i" };
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) return res.status(404).json({ message: "Task not found." });

    res.json({ task });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const validationError = validateTaskInput(req.body);
    if (validationError) return res.status(400).json({ message: validationError });

    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || "",
      status: status || "pending",
      priority: priority || "medium",
      dueDate: dueDate || null,
      user: req.user._id
    });

    res.status(201).json({ message: "Task created.", task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const validationError = validateTaskInput(req.body);
    if (validationError) return res.status(400).json({ message: validationError });

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const allowedFields = ["title", "description", "status", "priority", "dueDate"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = field === "title" || field === "description"
          ? req.body[field].trim()
          : req.body[field];
      }
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found." });

    res.json({ message: "Task updated.", task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) return res.status(404).json({ message: "Task not found." });

    res.json({ message: "Task deleted." });
  } catch (error) {
    next(error);
  }
};

export const toggleTask = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) return res.status(404).json({ message: "Task not found." });

    task.status = task.status === "completed" ? "pending" : "completed";
    await task.save();

    res.json({ message: "Task status updated.", task });
  } catch (error) {
    next(error);
  }
};
