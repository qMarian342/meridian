import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="login-wrapper">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1 className="login-title">Meridian App</h1>
                <p className="login-subtitle">Sign in to your account</p>

                <label className="form-label" htmlFor="email">Email</label>
                <input
                    id="email" type="email" className="form-input"
                    value={email} onChange={(e) => setEmail(e.target.value)} required
                />

                <label className="form-label" htmlFor="password">Password</label>
                <input
                    id="password" type="password" className="form-input"
                    value={password} onChange={(e) => setPassword(e.target.value)} required
                />

                {error && <p className="login-error">{error}</p>}

                <button className="login-btn" type="submit" disabled={submitting}>
                    {submitting ? "Signing in…" : "Sign in"}
                </button>
            </form>
        </div>
    );
}