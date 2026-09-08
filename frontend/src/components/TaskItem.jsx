export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const due = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  return (
    <article className={`task-card ${task.status === "completed" ? "completed" : ""}`}>
      <div className="task-main">
        <button
          className="check-btn"
          title="Toggle completed"
          onClick={() => onToggle(task._id)}
        >
          {task.status === "completed" ? "✓" : ""}
        </button>

        <div className="task-content">
          <div className="task-heading">
            <h3>{task.title}</h3>
            <span className={`priority ${task.priority}`}>{task.priority}</span>
          </div>

          {task.description && <p>{task.description}</p>}

          <div className="task-meta">
            <span>📅 {due}</span>
            <span>{task.status}</span>
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button onClick={() => onEdit(task)}>Edit</button>
        <button className="danger-btn" onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </article>
  );
}
