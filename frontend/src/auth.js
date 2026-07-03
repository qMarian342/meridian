import { login as loginRequest } from "./api";

export function getUser() {
    const stored = localStorage.getItem("meridian_user");
    return stored ? JSON.parse(stored) : null;
}

export async function doLogin(email, password) {
    const employee = await loginRequest(email, password);
    localStorage.setItem("meridian_user", JSON.stringify(employee));
    return employee;
}

export function doLogout() {
    localStorage.removeItem("meridian_user");
    window.location.href = "/login"; 
}