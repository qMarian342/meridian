import { useState, useEffect } from "react";
import UserCard from "../components/UserCard";
import { getAllEmployees } from "../api";

export default function TeamDirectory() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedDept, setSelectedDept] = useState("all");

    useEffect(() => {
        async function fetchEmployees() {
            try {
                const data = await getAllEmployees();
                setEmployees(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchEmployees();
    }, []);

    if (loading) {
        return <p className="status-message">Loading Employees..</p>;
    }

    if (error) {
        return <p className="status-message">Error: {error}</p>;
    }

    const departmentNames = [
        ...new Set(employees.map((e) => e.department.name)),
    ].sort();

    const visibleEmployees =
        selectedDept === "all"
            ? employees
            : employees.filter((e) => e.department.name === selectedDept);

    return (
        <div>
            <h1 className="page-title">Team Directory</h1>
            <p className="page-subtitle">
                Showing {visibleEmployees.length} of {employees.length} employees
            </p>

            { }
            <div className="directory-filter">
                <label className="form-label" htmlFor="dept-filter">
                    Department
                </label>
                <select
                    className="form-select"
                    id="dept-filter"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                >
                    <option value="all">All departments</option>
                    {departmentNames.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            {visibleEmployees.length === 0 ? (
                <p className="status-message">No employees in this department.</p>
            ) : (
                <div className="cards-grid">
                    {visibleEmployees.map((employee) => (
                        <UserCard key={employee.id} employee={employee} />
                    ))}
                </div>
            )}
        </div>
    );
}