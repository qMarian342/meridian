import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ProtectedRoute({ children, requireHr = false }) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;
    if (requireHr && user.role !== "hr") return <Navigate to="/" replace />;

    return children;
}