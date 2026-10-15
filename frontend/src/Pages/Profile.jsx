import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-bold tracking-tight">Profilo</h1>
      <dl className="mt-6 space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
        <div>
          <dt className="text-sm text-stone-500">Nome</dt>
          <dd className="font-medium">{user.name}</dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Email</dt>
          <dd className="font-medium">{user.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Ruolo</dt>
          <dd className="font-medium">{user.role === "admin" ? "Amministratore" : "Cliente"}</dd>
        </div>
      </dl>
      <div className="mt-6 flex gap-3">
        <Link to="/orders" className="rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white hover:bg-stone-700">
          I miei ordini
        </Link>
        <button onClick={logout} className="rounded-full border border-stone-300 px-5 py-2 text-sm font-medium hover:bg-stone-100">
          Esci
        </button>
      </div>
    </div>
  );
}