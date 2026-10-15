import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api, formatPrice } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api(`/products/${id}`).then(setProduct).catch((err) => setError(err.message));
  }, [id]);

  async function handleAdd() {
    if (!user) return navigate("/login");
    setError("");
    setMessage("");
    try {
      await addToCart(product.id, quantity);
      setMessage("Aggiunto al carrello ✓");
    } catch (err) {
      setError(err.message);
    }
  }

  if (error && !product) return <p className="text-red-600">{error}</p>;
  if (!product) return <p className="text-stone-500">Caricamento...</p>;

  return (
    <div>
      <Link to="/products" className="text-sm text-stone-500 hover:text-stone-900">← Tutti i prodotti</Link>
      <div className="mt-4 grid gap-10 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-100 to-stone-100">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-9xl font-bold text-indigo-300">{product.name[0]}</span>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">{product.category_name}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold">{formatPrice(product.price)}</p>
          <p className="mt-4 text-stone-600">{product.description}</p>
          <p className="mt-4 text-sm text-stone-500">
            {product.stock > 0 ? `${product.stock} disponibili` : "Esaurito"}
          </p>

          {product.stock > 0 && (
            <div className="mt-6 flex items-center gap-4">
              <input
                type="number" min={1} max={product.stock} value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-20 rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-center outline-none focus:border-indigo-500"
              />
              <button onClick={handleAdd}
                className="rounded-full bg-indigo-600 px-8 py-3 font-semibold text-white transition hover:bg-indigo-700">
                Aggiungi al carrello
              </button>
            </div>
          )}
          {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}