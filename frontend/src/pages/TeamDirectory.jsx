import { useState, useEffect } from "react";
import UserCard from "../components/UserCard";
import { getAllEmployees } from "../api";

export default function TeamDirectory(){
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchEmployees(){
            try{
                const data = await getAllEmployees();
                setEmployees(data);
            }catch(err){
                setError(err.message);
            }finally{
                setLoading(false);
            }
        }
        
        fetchEmployees();

    },[]);

    if(loading){
        return <p className="status-message">Loading Employees..</p>;
    }

    if(error){
        return <p className="status-message">Error: {error}</p>;
    }

    return(
        <div>
            <h1 className="page-title">Team Directory</h1>
            <p className="page-subtitle"> {employees.length} employees!</p>
        
        { }

            <div className="cards-grid">
                    {employees.map((employee) => (
                        <UserCard key={employee.id} employee={employee} />
                    ))}
            </div>
            
        </div>
    );
}