import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-7xl font-bold text-indigo-300">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Pagina non trovata</h1>
      <p className="mt-2 text-stone-500">L'indirizzo che cerchi non esiste.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-700"
      >
        Torna alla Home
      </Link>
    </div>
  );
}