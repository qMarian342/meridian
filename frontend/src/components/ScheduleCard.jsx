export default function ScheduleCard({ entry }) {
    const isOffice = entry.location === "office";

    return (
        <div className="card schedule-card">
            <div className="schedule-card-info">
                <p className="schedule-card-name">{entry.full_name}</p>
                <p className="schedule-card-department">{entry.department_name}</p>
            </div>

            <span className={`badge ${isOffice ? "badge-office" : "badge-remote"}`}>
                {isOffice ? "Office" : "Remote"}
            </span>
        </div>
    );
}