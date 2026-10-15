import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-3xl font-bold tracking-tight">Accedi</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Email" className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Password" className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-xl bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700">
          Accedi
        </button>
      </form>
      <p className="mt-4 text-sm text-stone-500">
        Non hai un account? <Link to="/register" className="font-medium text-indigo-600">Registrati</Link>
      </p>
    </div>
  );
}