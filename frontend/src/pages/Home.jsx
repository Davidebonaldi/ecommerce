import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api("/products").then((p) => setProducts(p.slice(0, 4))).catch(() => {});
    api("/categories").then(setCategories).catch(() => {});
  }, []);

  return (
    <div className="space-y-16">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-stone-900 px-8 py-20 text-center text-white sm:py-28">
        <p className="text-sm font-medium uppercase tracking-widest text-indigo-200">
          Nuovi arrivi
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Trova quello che ti serve.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-indigo-100">
          Una selezione di prodotti scelti con cura, spedizione semplice e checkout veloce.
        </p>
        <Link
          to="/products"
          className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50"
        >
          Scopri i prodotti
        </Link>
      </section>

      {categories.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold tracking-tight">Categorie</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/products?category=${c.slug}`}
                className="rounded-2xl border border-stone-200 bg-white p-6 text-center font-semibold transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Ultimi prodotti</h2>
            <Link to="/products" className="text-sm font-medium text-indigo-600 hover:underline">
              Vedi tutti →
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}