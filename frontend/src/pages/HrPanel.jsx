import { useState, useEffect } from "react";
import { getAllEmployees, getAllTasks, createEmployee, createTask, updateTask, deleteTask, updateSchedule, getDepartments } from "../api";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function HrPanel() {
    return (
        <div>
            <h1 className="page-title">HR Panel</h1>
            <p className="page-subtitle">Manage employees, tasks and schedules.</p>

            <div className="hr-sections">
                <AddEmployeeSection />
                <ManageTasksSection />
                <EditScheduleSection />
            </div>
        </div>
    );
}

function AddEmployeeSection() {
    const [departments, setDepartments] = useState([]);
    const [form, setForm] = useState({
        full_name: "", email: "", role_title: "",
        department_id: "", start_date: "", password: "",
    });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        getDepartments()
            .then((data) => {
                setDepartments(data);
                if (data.length > 0) {
                    setForm((prev) => ({ ...prev, department_id: data[0].id }));
                }
            })
            .catch(() => setMessage({ type: "err", text: "Couldn't load departments" }));
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage(null);
        try {
            await createEmployee({ ...form, department_id: Number(form.department_id) });
            setMessage({ type: "ok", text: `Employee "${form.full_name}" created.` });
            setForm({
                full_name: "", email: "", role_title: "",
                department_id: departments[0]?.id ?? "",
                start_date: "", password: "",
            });
} catch (err) {
            setMessage({ type: "err", text: err.message });
        }
    }

    return (
        <section className="dashboard-section">
            <h2 className="section-title">Add employee</h2>
            <form className="hr-form" onSubmit={handleSubmit}>
                <input className="form-input" name="full_name" placeholder="Full name"
                    value={form.full_name} onChange={handleChange} required />
                <input className="form-input" name="email" type="email" placeholder="Email"
                    value={form.email} onChange={handleChange} required />
                <input className="form-input" name="role_title" placeholder="Role title (e.g. Junior Developer)"
                    value={form.role_title} onChange={handleChange} required />
                <select className="form-select" name="department_id"
                    value={form.department_id} onChange={handleChange}>
                    {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                <input className="form-input" name="start_date" type="date"
                    value={form.start_date} onChange={handleChange} required />
                <input className="form-input" name="password" type="password" placeholder="Temporary password"
                    value={form.password} onChange={handleChange} required />
                <button className="login-btn" type="submit">Create employee</button>
            </form>
            {message && <p className={message.type === "ok" ? "hr-ok" : "hr-err"}>{message.text}</p>}
        </section>
    );
}

function ManageTasksSection() {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({ title: "", description: "", display_order: 0 });
    const [message, setMessage] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", description: "", display_order: 0 });

    useEffect(() => {
        getAllTasks().then(setTasks).catch(() => setMessage({ type: "err", text: "Couldn't load tasks" }));
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage(null);
        try {
            const created = await createTask({
                title: form.title,
                description: form.description || null,
                display_order: Number(form.display_order),
            });
            setTasks((prev) => [...prev, created]);
            setForm({ title: "", description: "", display_order: 0 });
            setMessage({ type: "ok", text: "Task added." });
        } catch (err) {
            setMessage({ type: "err", text: err.message });
        }
    }

    function startEdit(task) {
        setEditingId(task.id);
        setEditForm({
            title: task.title,
            description: task.description || "",
            display_order: task.display_order,
        });
        setMessage(null);
    }

    function handleEditChange(e) {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    }

    async function saveEdit(taskId) {
        try {
            const updated = await updateTask(taskId, {
                title: editForm.title,
                description: editForm.description || null,
                display_order: Number(editForm.display_order),
            });
            setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
            setEditingId(null);
            setMessage({ type: "ok", text: "Task updated." });
        } catch (err) {
            setMessage({ type: "err", text: err.message });
        }
    }

    async function handleDelete(taskId) {
        if (!window.confirm("Delete this task? Progress for all employees will be removed.")) return;
        try {
            await deleteTask(taskId);
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
            if (editingId === taskId) setEditingId(null);
            setMessage({ type: "ok", text: "Task deleted." });
        } catch (err) {
            setMessage({ type: "err", text: err.message });
        }
    }

    return (
        <section className="dashboard-section">
            <h2 className="section-title">
                Checklist tasks <span className="section-counter">{tasks.length}</span>
            </h2>

            <ul className="hr-task-list">
                {tasks.map((t) => (
                    <li key={t.id} className="hr-task-item">
                        {editingId === t.id ? (
                            <div className="hr-form">
                                <input className="form-input" name="title"
                                    value={editForm.title} onChange={handleEditChange} />
                                <input className="form-input" name="description" placeholder="Description (optional)"
                                    value={editForm.description} onChange={handleEditChange} />
                                <input className="form-input" name="display_order" type="number"
                                    value={editForm.display_order} onChange={handleEditChange} />
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button className="filter-btn" onClick={() => saveEdit(t.id)}>Save</button>
                                    <button className="filter-btn" onClick={() => setEditingId(null)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                                <span><strong>{t.display_order}.</strong> {t.title}</span>
                                <div style={{ display: "flex", gap: "0.4rem" }}>
                                    <button className="filter-btn" onClick={() => startEdit(t)}>Edit</button>
                                    <button className="filter-btn" onClick={() => handleDelete(t.id)}>Delete</button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <form className="hr-form" onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
                <input className="form-input" name="title" placeholder="Task title"
                    value={form.title} onChange={handleChange} required />
                <input className="form-input" name="description" placeholder="Description (optional)"
                    value={form.description} onChange={handleChange} />
                <input className="form-input" name="display_order" type="number" placeholder="Order"
                    value={form.display_order} onChange={handleChange} />
                <button className="login-btn" type="submit">Add task</button>
            </form>
            {message && <p className={message.type === "ok" ? "hr-ok" : "hr-err"}>{message.text}</p>}
        </section>
    );
}

function EditScheduleSection() {
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({ employee_id: "", day_of_week: "Monday", location: "office" });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        getAllEmployees().then(setEmployees).catch(() => setMessage({ type: "err", text: "Couldn't load employees" }));
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage(null);
        if (!form.employee_id) {
            setMessage({ type: "err", text: "Pick an employee first." });
            return;
        }
        try {
            await updateSchedule(Number(form.employee_id), form.day_of_week, form.location);
            setMessage({ type: "ok", text: "Schedule updated." });
        } catch (err) {
            setMessage({ type: "err", text: err.message });
        }
    }

    return (
        <section className="dashboard-section">
            <h2 className="section-title">Edit schedule</h2>
            <form className="hr-form" onSubmit={handleSubmit}>
                <select className="form-select" name="employee_id"
                    value={form.employee_id} onChange={handleChange}>
                    <option value="">— select employee —</option>
                    {employees.map((e) => (
                        <option key={e.id} value={e.id}>{e.full_name}</option>
                    ))}
                </select>
                <select className="form-select" name="day_of_week" value={form.day_of_week} onChange={handleChange}>
                    {WEEKDAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <select className="form-select" name="location" value={form.location} onChange={handleChange}>
                    <option value="office">Office</option>
                    <option value="remote">Remote</option>
                </select>
                <button className="login-btn" type="submit">Update schedule</button>
            </form>
            {message && <p className={message.type === "ok" ? "hr-ok" : "hr-err"}>{message.text}</p>}
        </section>
    );
}