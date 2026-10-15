import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { api, formatPrice } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { StatusBadge } from "./Orders";

export default function OrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const { state } = useLocation();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/orders/${id}`, { token }).then(setOrder).catch((err) => setError(err.message));
  }, [id, token]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!order) return <p className="text-stone-500">Caricamento...</p>;

  return (
    <div>
      <Link to="/orders" className="text-sm text-stone-500 hover:text-stone-900">← I miei ordini</Link>

      {state?.justOrdered && (
        <div className="mt-4 rounded-2xl bg-green-50 p-4 text-green-800">
          Grazie! Il tuo ordine è stato ricevuto.
        </div>
      )}

      <div className="mt-4 flex items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Ordine #{order.id}</h1>
        <StatusBadge status={order.status} />
      </div>
      <p className="mt-2 text-stone-500">
        {new Date(order.created_at).toLocaleString("it-IT")} · Spedizione a: {order.shipping_address}
      </p>

      <ul className="mt-6 divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
        {order.items.map((i) => (
          <li key={i.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{i.product_name}</p>
              <p className="text-sm text-stone-500">{formatPrice(i.unit_price)} × {i.quantity}</p>
            </div>
            <span className="font-semibold">{formatPrice(i.subtotal)}</span>
          </li>
        ))}
        <li className="flex justify-between p-4 text-lg font-bold">
          <span>Totale</span>
          <span>{formatPrice(order.total)}</span>
        </li>
      </ul>
    </div>
  );
}