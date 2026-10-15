import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="py-16 text-center">
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
        Trova quello che ti serve.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-stone-500">
        Una selezione di prodotti scelti con cura, spedizione semplice e checkout veloce.
      </p>
      <Link
        to="/products"
        className="mt-8 inline-block rounded-full bg-indigo-600 px-8 py-3 font-semibold text-white transition hover:bg-indigo-700"
      >
        Scopri i prodotti
      </Link>
    </section>
  );
}