import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, formatPrice } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { token } = useAuth();
  const { cart, refresh } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (cart.items.length === 0) {
    return (
      <p className="text-stone-500">
        Il carrello è vuoto. <Link to="/products" className="font-medium text-indigo-600">Vai ai prodotti</Link>
      </p>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const order = await api("/orders", {
        method: "POST",
        body: { shipping_address: address },
        token,
      });
      await refresh();
      navigate(`/orders/${order.id}`, { state: { justOrdered: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-2">
          <label className="block text-sm font-medium">Indirizzo di spedizione</label>
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Via, numero civico, CAP, città"
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={loading}
            className="rounded-full bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Invio..." : "Conferma ordine"}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-semibold">Riepilogo</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {cart.items.map((i) => (
              <li key={i.id} className="flex justify-between">
                <span>{i.name} × {i.quantity}</span>
                <span>{formatPrice(i.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 text-lg font-bold">
            <span>Totale</span>
            <span>{formatPrice(cart.total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}