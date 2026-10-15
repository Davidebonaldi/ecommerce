import { useEffect, useState } from "react";
import { api, formatPrice } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { STATUS_LABELS, StatusBadge } from "../Orders";

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const query = filter ? `?status=${filter}` : "";
    setOrders(await api(`/admin/orders${query}`, { token }));
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [filter]);

  async function changeStatus(id, status) {
    setError("");
    try {
      await api(`/admin/orders/${id}/status`, { method: "PUT", body: { status }, token });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Ordini</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm">
          <option value="">Tutti gli stati</option>
          {Object.entries(STATUS_LABELS).map(([value, s]) => (
            <option key={value} value={value}>{s.label}</option>
          ))}
        </select>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 text-stone-500">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Data</th>
              <th className="p-3">Totale</th>
              <th className="p-3">Stato</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-stone-100 last:border-0">
                <td className="p-3 font-medium">{o.id}</td>
                <td className="p-3">
                  {o.user_name}
                  <span className="block text-xs text-stone-400">{o.user_email}</span>
                </td>
                <td className="p-3">{new Date(o.created_at).toLocaleDateString("it-IT")}</td>
                <td className="p-3">{formatPrice(o.total)}</td>
                <td className="p-3">
                  {o.status === "cancelled" ? (
                    <StatusBadge status="cancelled" />
                  ) : (
                    <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)}
                      className="rounded-lg border border-stone-300 bg-white px-2 py-1 text-xs">
                      {Object.entries(STATUS_LABELS).map(([value, s]) => (
                        <option key={value} value={value}>{s.label}</option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-stone-400">Nessun ordine.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}