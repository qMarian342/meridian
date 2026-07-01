const BASE_URL = "http://localhost:8000";

export async function getAllEmployees(){
    const response = await fetch(`${BASE_URL}/employees`);

    if(!response.ok){
        throw new Error(`Employee with ID ${employeeId} not found`);
    }
    return response.json();
}

export async function getChecklistForEmployee(employeeId){
    const response = await fetch(`${BASE_URL}/checklist/${employeeId}`);

    if(!response.ok){
        throw new Error("Couldn't load checklist");
    }

    return response.json();
}

export async function updateChecklistItem(employeeId, taskId, isCompleted){
    const response = await fetch(
        `${BASE_URL}/checklist/${employeeId}/${taskId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ is_completed: isCompleted }),
        }
    );

    if (!response.ok) {
        throw new Error("Can't update task");
    }

    return response.json();
}

export async function getTodaySchedule() {
    const response = await fetch(`${BASE_URL}/schedule/today`);

    if (!response.ok) {
        throw new Error("Couldn't load todays schedule");
    }

    return response.json();
}

export async function getTodayScheduleByLocation(location) {
    const url = location
        ? `${BASE_URL}/schedule/today/filter?location=${location}`
        : `${BASE_URL}/schedule/today/filter`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Couldn't load filtered schedule");
    }

    return response.json();
}

export async function getEmployeeSchedule(employeeId) {
    const response = await fetch(`${BASE_URL}/schedule/${employeeId}`);

    if (!response.ok) {
        throw new Error("Couldn't load employee schedule");
    }

    return response.json();
}

