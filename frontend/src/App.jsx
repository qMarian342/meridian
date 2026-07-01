import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TeamDirectory from "./pages/TeamDirectory";
import HybridSchedule from "./pages/HybridSchedule";
import "./index.css";

export default function App() {
    return (
        <BrowserRouter>
            { }
            <nav className="navbar">
                <span className="navbar-brand"> Meridian App</span>

                { }
                <div className="navbar-links">
                    <NavLink to="/">Dashboard</NavLink>
                    <NavLink to="/team">Team Directory</NavLink>
                    <NavLink to="/schedule">Hybrid Schedule</NavLink>
                </div>
            </nav>

            { }
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/team" element={<TeamDirectory />} />
                    <Route path="/schedule" element={<HybridSchedule />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}