import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

// Must match validatePassword() in backend/src/routes/auth.ts
const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "At least one letter", test: (p: string) => /[A-Za-z]/.test(p) },
  { label: "At least one number", test: (p: string) => /[0-9]/.test(p) },
];

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const rules = PASSWORD_RULES.map((r) => ({ label: r.label, met: r.test(password) }));
  const passwordOk = rules.every((r) => r.met);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!passwordOk) {
      setError("Password is too weak. Meet all the rules below the password field.");
      return;
    }
    try {
      await signup(email, password);
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="auth-page">
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-describedby="password-rules"
        />
        <ul id="password-rules" className="password-rules">
          {rules.map((r) => (
            <li key={r.label} className={r.met ? "met" : ""}>
              {r.met ? "✓" : "○"} {r.label}
            </li>
          ))}
        </ul>
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
