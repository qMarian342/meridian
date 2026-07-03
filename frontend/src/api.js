const BASE_URL = "http://localhost:8000";

import { getUser } from "./auth";

export async function getAllEmployees(){
    const response = await fetch(`${BASE_URL}/employees`);

    if(!response.ok){
        throw new Error(`Employee not found`);
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

export async function login(email, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error("Invalid email or password");
    }

    return response.json();
}

function hrHeaders() {
    const user = getUser();
    return {
        "Content-Type": "application/json",
        "X-Employee-Id": user.id,
    };
}

export async function createEmployee(employeeData) {
    const response = await fetch(`${BASE_URL}/hr/employees`, {
        method: "POST",
        headers: hrHeaders(),
        body: JSON.stringify(employeeData),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Couldn't create employee");
    }
    return response.json();
}

export async function getAllTasks() {
    const response = await fetch(`${BASE_URL}/hr/tasks`, {
        headers: hrHeaders(),
    });
    if (!response.ok) throw new Error("Couldn't load tasks");
    return response.json();
}

export async function createTask(taskData) {
    const response = await fetch(`${BASE_URL}/hr/tasks`, {
        method: "POST",
        headers: hrHeaders(),
        body: JSON.stringify(taskData),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Couldn't create task");
    }
    return response.json();
}

export async function updateSchedule(employeeId, dayOfWeek, location) {
    const response = await fetch(`${BASE_URL}/hr/schedule/${employeeId}`, {
        method: "PUT",
        headers: hrHeaders(),
        body: JSON.stringify({ day_of_week: dayOfWeek, location }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Couldn't update schedule");
    }
    return response.json();
}

export async function getDepartments() {
    const response = await fetch(`${BASE_URL}/departments`);
    if (!response.ok) {
        throw new Error("Couldn't load departments");
    }
    return response.json();
}

export async function updateTask(taskId, taskData) {
    const response = await fetch(`${BASE_URL}/hr/tasks/${taskId}`, {
        method: "PUT",
        headers: hrHeaders(),
        body: JSON.stringify(taskData),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Couldn't update task");
    }
    return response.json();
}

export async function deleteTask(taskId) {
    const response = await fetch(`${BASE_URL}/hr/tasks/${taskId}`, {
        method: "DELETE",
        headers: hrHeaders(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Couldn't delete task");
    }
    return response.json();
}