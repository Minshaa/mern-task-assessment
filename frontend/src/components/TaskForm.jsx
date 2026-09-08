import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: ""
};

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ""
      });
    } else {
      setForm(emptyForm);
    }
  }, [task]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      ...form,
      dueDate: form.dueDate || null
    });

    if (!task) setForm(emptyForm);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{task ? "Edit Task" : "Add New Task"}</h2>

      <input
        name="title"
        placeholder="Task title"
        value={form.title}
        onChange={handleChange}
        maxLength={120}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows="4"
        maxLength={1000}
      />

      <div className="form-grid">
        <label>
          Priority
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          Due date
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="form-actions">
        <button className="primary-btn" type="submit">
          {task ? "Update Task" : "Add Task"}
        </button>
        {task && (
          <button className="secondary-btn" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
