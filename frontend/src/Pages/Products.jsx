import { useEffect, useState } from "react";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/categories").then(setCategories).catch(() => {});
  }, []);

  // Attende 300 ms dopo l'ultima digitazione prima di chiamare l'API
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (category) params.set("category", category);
        setProducts(await api(`/products?${params}`));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Prodotti</h1>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca un prodotto..."
          className="w-full rounded-full border border-stone-300 bg-white px-5 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("")}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              category === "" ? "bg-stone-900 text-white" : "bg-white text-stone-600 hover:bg-stone-100"
            }`}
          >
            Tutti
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.slug)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                category === c.slug ? "bg-stone-900 text-white" : "bg-white text-stone-600 hover:bg-stone-100"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-8 text-red-600">{error}</p>}
      {loading && <p className="mt-8 text-stone-500">Caricamento...</p>}
      {!loading && !error && products.length === 0 && (
        <p className="mt-8 text-stone-500">Nessun prodotto trovato.</p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}