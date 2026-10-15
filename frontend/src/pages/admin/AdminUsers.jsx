import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsers() {
  const { user: me, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    setUsers(await api("/admin/users", { token }));
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function changeRole(id, role) {
    setError("");
    try {
      await api(`/admin/users/${id}/role`, { method: "PUT", body: { role }, token });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Eliminare questo utente?")) return;
    setError("");
    try {
      await api(`/admin/users/${id}`, { method: "DELETE", token });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Utenti</h1>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 text-stone-500">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Email</th>
              <th className="p-3">Ordini</th>
              <th className="p-3">Ruolo</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-stone-100 last:border-0">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.orders_count}</td>
                <td className="p-3">
                  <select value={u.role} disabled={u.id === me.id}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="rounded-lg border border-stone-300 bg-white px-2 py-1 text-xs disabled:opacity-50">
                    <option value="customer">Cliente</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3 text-right">
                  {u.id !== me.id && (
                    <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:underline">Elimina</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}