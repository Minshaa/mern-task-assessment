export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: Object.values(err.errors).map((e) => e.message).join(", ")
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: "Email is already registered." });
  }

  res.status(statusCode).json({
    message: err.message || "Server error"
  });
};
