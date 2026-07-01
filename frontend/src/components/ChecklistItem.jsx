export default function ChecklistItem({ item, onToggle }) {
    return (
        <div className={`checklist-item card ${item.is_completed ? "completed" : ""}`}>
            { }
            <input
                type="checkbox"
                className="checklist-checkbox"
                checked={item.is_completed}
                onChange={() => onToggle(item.task_id, !item.is_completed)}
            />

            <div className="checklist-item-text">
                <p className="checklist-item-title">{item.title}</p>
                { }
                {item.description && (
                    <p className="checklist-item-description">{item.description}</p>
                )}
            </div>

            { }
            {item.is_completed && (
                <span className="checklist-done-badge">Done</span>
            )}
        </div>
    );
}