import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatPrice } from "../services/api";
import { useAuth } from "../context/AuthContext";

export const STATUS_LABELS = {
  pending: { label: "In attesa", color: "bg-amber-100 text-amber-800" },
  paid: { label: "Pagato", color: "bg-blue-100 text-blue-800" },
  shipped: { label: "Spedito", color: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Consegnato", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Annullato", color: "bg-red-100 text-red-800" },
};

export function StatusBadge({ status }) {
  const s = STATUS_LABELS[status];
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${s.color}`}>{s.label}</span>;
}

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/orders", { token }).then(setOrders).catch((err) => setError(err.message));
  }, [token]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!orders) return <p className="text-stone-500">Caricamento...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">I miei ordini</h1>
      {orders.length === 0 ? (
        <p className="mt-6 text-stone-500">Non hai ancora effettuato ordini.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link to={`/orders/${o.id}`}
                className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 transition hover:shadow-md">
                <div>
                  <p className="font-semibold">Ordine #{o.id}</p>
                  <p className="text-sm text-stone-500">{new Date(o.created_at).toLocaleDateString("it-IT")}</p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={o.status} />
                  <span className="font-bold">{formatPrice(o.total)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}