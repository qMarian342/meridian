import { useState, useEffect } from "react";
import UserCard from "../components/UserCard";
import ChecklistItem from "../components/ChecklistItem";
import ScheduleCard from "../components/ScheduleCard";
import {
    getAllEmployees,
    getChecklistForEmployee,
    getTodaySchedule,
    updateChecklistItem,
} from "../api";

const CURRENT_EMPLOYEE_ID = 1;

export default function Dashboard() {
    const [employees, setEmployees] = useState([]);
    const [checklist, setChecklist] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchAllData() {
            try {
                const [employeesData, checklistData, scheduleData] =
                    await Promise.all([
                        getAllEmployees(),
                        getChecklistForEmployee(CURRENT_EMPLOYEE_ID),
                        getTodaySchedule(),
                    ]);

                setEmployees(employeesData);
                setChecklist(checklistData);
                setSchedule(scheduleData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchAllData();
    }, []);

    async function handleToggleTask(taskId, newStatus) {
        try {
            const updatedItem = await updateChecklistItem(
                CURRENT_EMPLOYEE_ID,
                taskId,
                newStatus
            );

            setChecklist((prev) =>
                prev.map((item) =>
                    item.task_id === updatedItem.task_id ? updatedItem : item
                )
            );
        } catch (err) {
            alert("Couldn't load task. Try again!");
        }
    }


    if (loading) {
        return <p className="status-message">Dashboard loading..</p>;
    }

    if (error) {
        return <p className="status-message">Error: {error}</p>;
    }

    const completedCount = checklist.filter((t) => t.is_completed).length;
    const totalCount = checklist.length;
    const progressPercent =
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div>
            <h1 className="page-title">Welcome!</h1>
            <p className="page-subtitle">
                This week tasks!
            </p>

            <div className="dashboard-grid">

                {/* CHECKLIST */}
                <section className="dashboard-section">
                    <h2 className="section-title">
                        My First Week
                        <span className="section-counter">
                            {completedCount}/{totalCount}
                        </span>
                    </h2>

                    {/* Progress bar */}
                    <div className="progress-bar-bg">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <p className="progress-label">{progressPercent}% completed</p>

                    <div className="cards-list" style={{ marginTop: "1rem" }}>
                        {checklist.map((item) => (
                            <ChecklistItem
                                key={item.task_id}
                                item={item}
                                onToggle={handleToggleTask}
                            />
                        ))}
                    </div>
                </section>

                {/* SCHEDULE */}
                <section className="dashboard-section">
                    <h2 className="section-title">
                        Who is at office today?
                        <span className="section-counter">
                            {schedule.length} 
                        </span>
                    </h2>

                    <div className="cards-list">
                        {schedule.map((entry) => (
                            <ScheduleCard
                                key={entry.employee_id}
                                entry={entry}
                            />
                        ))}
                    </div>
                </section>

                {/* TEAM */}
                <section className="dashboard-section full-width">
                    <h2 className="section-title">
                        Your team!
                        <span className="section-counter">
                            {employees.length} total
                        </span>
                    </h2>

                    <div className="cards-grid">
                        { }
                        {employees.slice(0, 4).map((employee) => (
                            <UserCard key={employee.id} employee={employee} />
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}