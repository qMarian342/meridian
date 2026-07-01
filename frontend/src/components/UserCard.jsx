export default function UserCard({employee}){
    return(
        <div className="card user-card">
            { }
            <div className="user-card-avatar">
                {employee.full_name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
            </div>

            <div className="user-card-info">
                <h3 className="user-card-name">{employee.full_name}</h3>
                <p className="user-card-role">{employee.role_title}</p>
                <span className="badge badge-department">
                    {employee.department.name}
                </span>
            </div>
        </div>
    );
}