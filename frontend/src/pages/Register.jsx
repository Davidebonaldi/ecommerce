import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-3xl font-bold tracking-tight">Crea account</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input required value={form.name} onChange={set("name")} placeholder="Nome" className={inputClass} />
        <input type="email" required value={form.email} onChange={set("email")} placeholder="Email" className={inputClass} />
        <input type="password" required minLength={8} value={form.password} onChange={set("password")}
          placeholder="Password (min. 8 caratteri)" className={inputClass} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-xl bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700">
          Registrati
        </button>
      </form>
      <p className="mt-4 text-sm text-stone-500">
        Hai già un account? <Link to="/login" className="font-medium text-indigo-600">Accedi</Link>
      </p>
    </div>
  );
}