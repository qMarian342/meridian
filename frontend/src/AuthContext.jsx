import { createContext, useContext, useState } from "react";
import { login as loginRequest } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("meridian_user");
        return stored ? JSON.parse(stored) : null;
    });

    async function login(email, password) {
        const employee = await loginRequest(email, password);
        localStorage.setItem("meridian_user", JSON.stringify(employee));
        setUser(employee);
        return employee;
    }

    function logout() {
        localStorage.removeItem("meridian_user");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}