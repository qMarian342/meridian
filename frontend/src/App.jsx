import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TeamDirectory from "./pages/TeamDirectory";
import HybridSchedule from "./pages/HybridSchedule";
import "./index.css";
import HrPanel from "./pages/HrPanel";

function Navbar() {
    const { user, logout } = useAuth();
    if (!user) return null;

    return (
        <nav className="navbar">
            <span className="navbar-brand">Meridian App</span>
            <div className="navbar-links">
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/team">Team Directory</NavLink>
                <NavLink to="/schedule">Hybrid Schedule</NavLink>
                {user.role === "hr" && <NavLink to="/hr">HR Panel</NavLink>}
            </div>
            <div className="navbar-user">
                <span>{user.full_name}</span>
                <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
        </nav>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/team" element={<ProtectedRoute><TeamDirectory /></ProtectedRoute>} />
                    <Route path="/schedule" element={<ProtectedRoute><HybridSchedule /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                    <Route path="/hr" element={<ProtectedRoute requireHr><HrPanel /></ProtectedRoute>} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}