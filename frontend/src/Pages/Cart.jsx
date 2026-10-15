import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../services/api";

export default function Cart() {
  const { user } = useAuth();
  const { cart, updateItem, removeItem } = useCart();
  const [error, setError] = useState("");

  if (!user) {
    return (
      <p className="text-stone-600">
        <Link to="/login" className="font-medium text-indigo-600">Accedi</Link> per vedere il tuo carrello.
      </p>
    );
  }

  async function change(action) {
    setError("");
    try {
      await action();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Carrello</h1>

      {cart.items.length === 0 ? (
        <p className="mt-6 text-stone-500">
          Il carrello è vuoto. <Link to="/products" className="font-medium text-indigo-600">Vai ai prodotti</Link>
        </p>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <ul className="space-y-3 lg:col-span-2">
            {cart.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-2xl font-bold text-indigo-300">
                  {item.name[0]}
                </div>
                <div className="flex-1">
                  <Link to={`/products/${item.product_id}`} className="font-semibold hover:text-indigo-600">{item.name}</Link>
                  <p className="text-sm text-stone-500">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => change(() => updateItem(item.id, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                    className="h-8 w-8 rounded-full border border-stone-300 hover:bg-stone-100 disabled:opacity-40">−</button>
                  <span className="w-6 text-center font-medium">{item.quantity}</span>
                  <button onClick={() => change(() => updateItem(item.id, item.quantity + 1))}
                    className="h-8 w-8 rounded-full border border-stone-300 hover:bg-stone-100">+</button>
                </div>
                <p className="w-24 text-right font-semibold">{formatPrice(item.subtotal)}</p>
                <button onClick={() => change(() => removeItem(item.id))}
                  className="text-sm text-red-600 hover:underline">Rimuovi</button>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="font-semibold">Riepilogo</h2>
            <div className="mt-4 flex justify-between text-lg font-bold">
              <span>Totale</span>
              <span>{formatPrice(cart.total)}</span>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <button disabled
              className="mt-6 w-full rounded-xl bg-stone-300 py-3 font-semibold text-white">
              Checkout (prossimo task)
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}