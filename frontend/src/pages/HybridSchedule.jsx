import { useState, useEffect } from "react";
import ScheduleCard from "../components/ScheduleCard";
import { getTodaySchedule, getTodayScheduleByLocation } from "../api";

export default function HybridSchedule() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filter, setFilter] = useState(null);
    const today = new Date().toLocaleDateString("ro-RO", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    useEffect(() => {
        async function fetchSchedule() {
            try {
                setLoading(true);
                const data = filter
                    ? await getTodayScheduleByLocation(filter)
                    : await getTodaySchedule();
                setSchedule(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchSchedule();
    }, [filter]);

    if (error) {
        return <p className="status-message">Error: {error}</p>;
    }

    const officeCount = schedule.filter((e) => e.location === "office").length;
    const remoteCount = schedule.filter((e) => e.location === "remote").length;

    return (
        <div>
            <h1 className="page-title">Hybrid Schedule</h1>
            <p className="page-subtitle">
                { }
                {today.charAt(0).toUpperCase() + today.slice(1)}
            </p>

            { }
            <div className="schedule-summary">
                <div className="summary-card">
                    <span className="summary-number">{officeCount}</span>
                    <span className="summary-label">Office</span>
                </div>
                <div className="summary-card">
                    <span className="summary-number">{remoteCount}</span>
                    <span className="summary-label">Remote</span>
                </div>
            </div>

            { }
            <div className="filter-buttons">
                <button
                    className={`filter-btn ${filter === null ? "active" : ""}`}
                    onClick={() => setFilter(null)} >
                    All
                </button>
                <button
                    className={`filter-btn ${filter === "office" ? "active" : ""}`}
                    onClick={() => setFilter("office")} >
                     Office
                </button>
                <button
                    className={`filter-btn ${filter === "remote" ? "active" : ""}`}
                    onClick={() => setFilter("remote")} >
                     Remote
                </button>
            </div>

            {loading ? (
                <p className="status-message">Shedule loading..</p>) : schedule.length === 0 ? (
                <p className="status-message">
                    No employees for selected filter.
                </p>) : (
                <div className="cards-list">
                    {schedule.map((entry) => (
                        <ScheduleCard key={entry.employee_id} entry={entry} /> ))}
                </div>
            )}
        </div>
    );
}