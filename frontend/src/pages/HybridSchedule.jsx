import { useState, useEffect } from "react";
import ScheduleCard from "../components/ScheduleCard";
import { getUser } from "../auth";
import {
    getTodaySchedule,
    getTodayScheduleByLocation,
    getEmployeeSchedule,
} from "../api";


const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function HybridSchedule() {
    const CURRENT_EMPLOYEE_ID = getUser().id;
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState(null);

    const [myWeek, setMyWeek] = useState([]);
    const [weekError, setWeekError] = useState(null);

    const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

    const todayLabel = new Date().toLocaleDateString("en-EN", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    useEffect(() => {
        getEmployeeSchedule(CURRENT_EMPLOYEE_ID)
            .then(setMyWeek)
            .catch((err) => setWeekError(err.message));
    }, []);

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

    const locationByDay = {};
    for (const entry of myWeek) {
        locationByDay[entry.day_of_week] = entry.location;
    }

    const officeCount = schedule.filter((e) => e.location === "office").length;
    const remoteCount = schedule.filter((e) => e.location === "remote").length;

    return (
        <div>
            <h1 className="page-title">Hybrid Schedule</h1>
            <p className="page-subtitle">
                {todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1)}
            </p>

            { }
            <h2 className="section-title">My Week</h2>

            {weekError ? (
                <p className="status-message">Couldn't load your week: {weekError}</p>
            ) : myWeek.length === 0 ? (
                <p className="status-message">
                    You don't have a schedule set yet.
                </p>
            ) : (
                <div className="week-grid">
                    {WEEKDAYS.map((day) => {
                        const location = locationByDay[day];
                        const isToday = day === todayName;
                        return (
                            <div
                                key={day}
                                className={`week-day ${isToday ? "week-day-today" : ""}`}
                            >
                                <span className="week-day-name">{day.slice(0, 3)}</span>
                                {location ? (
                                    <span
                                        className={`badge ${
                                            location === "office"
                                                ? "badge-office"
                                                : "badge-remote"
                                        }`}
                                    >
                                        {location === "office" ? "Office" : "Remote"}
                                    </span>
                                ) : (
                                    <span className="week-day-off">—</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            { }
            <h2 className="section-title" style={{ marginTop: "2rem" }}>
                Who's in today?
            </h2>

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

            <div className="filter-buttons">
                <button
                    className={`filter-btn ${filter === null ? "active" : ""}`}
                    onClick={() => setFilter(null)}
                >
                    All
                </button>
                <button
                    className={`filter-btn ${filter === "office" ? "active" : ""}`}
                    onClick={() => setFilter("office")}
                >
                    Office
                </button>
                <button
                    className={`filter-btn ${filter === "remote" ? "active" : ""}`}
                    onClick={() => setFilter("remote")}
                >
                    Remote
                </button>
            </div>

            { }
            {error ? (
                <p className="status-message">Error: {error}</p>
            ) : loading ? (
                <p className="status-message">Schedule loading…</p>
            ) : schedule.length === 0 ? (
                <p className="status-message">
                    {filter
                        ? `No one is working ${filter} today.`
                        : "No one is scheduled today — enjoy the weekend!"}
                </p>
            ) : (
                <div className="cards-list">
                    {schedule.map((entry) => (
                        <ScheduleCard key={entry.employee_id} entry={entry} />
                    ))}
                </div>
            )}
        </div>
    );
}