import { useEffect, useMemo, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import api from "../services/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      const params = {};

      if (filter !== "all") params.status = filter;
      if (search.trim()) params.search = search.trim();

      const { data } = await api.get("/tasks", { params });
      setTasks(data.tasks);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadTasks, 250);
    return () => clearTimeout(timer);
  }, [filter, search]);

  const createOrUpdate = async (payload) => {
    try {
      if (editingTask) {
        const { data } = await api.put(`/tasks/${editingTask._id}`, payload);
        setTasks((current) =>
          current.map((task) => task._id === data.task._id ? data.task : task)
        );
        setEditingTask(null);
      } else {
        const { data } = await api.post("/tasks", payload);
        setTasks((current) => [data.task, ...current]);
      }
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save task.");
    }
  };

  const toggleTask = async (id) => {
    try {
      const { data } = await api.patch(`/tasks/${id}/toggle`);
      setTasks((current) =>
        current.map((task) => task._id === data.task._id ? data.task : task)
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update task.");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      setTasks((current) => current.filter((task) => task._id !== id));
      if (editingTask?._id === id) setEditingTask(null);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete task.");
    }
  };

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "completed").length;
    const pending = tasks.filter((task) => task.status === "pending").length;
    const percentage = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

    return { completed, pending, percentage };
  }, [tasks]);

  return (
    <main className="dashboard">
      <section className="hero">
        <div>
          <h1>Your Tasks</h1>
          <p>Plan your work and keep track of your progress.</p>
        </div>

        <div className="progress-card">
          <div className="progress-top">
            <span>Completed</span>
            <strong>{stats.percentage}%</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${stats.percentage}%` }} />
          </div>
          <small>{stats.completed} completed · {stats.pending} pending</small>
        </div>
      </section>

      {error && <div className="error page-error">{error}</div>}

      <section className="dashboard-grid">
        <TaskForm
          task={editingTask}
          onSubmit={createOrUpdate}
          onCancel={() => setEditingTask(null)}
        />

        <div className="task-panel">
          <div className="toolbar">
            <input
              className="search"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="filters">
              {["all", "pending", "completed"].map((value) => (
                <button
                  key={value}
                  className={filter === value ? "active-filter" : ""}
                  onClick={() => setFilter(value)}
                >
                  {value[0].toUpperCase() + value.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="empty-state">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <h3>No tasks found</h3>
              <p>Create a task or change your filter/search.</p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={setEditingTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
