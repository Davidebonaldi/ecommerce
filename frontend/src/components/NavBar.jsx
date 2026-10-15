import { Link, NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-stone-900" : "text-stone-500 hover:text-stone-900"
  }`;

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold tracking-tight">
          shop<span className="text-indigo-600">.</span>
        </Link>
        <nav className="flex items-center gap-6">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/products" className={linkClass}>Prodotti</NavLink>
          <NavLink to="/cart" className={linkClass}>Carrello</NavLink>
          <NavLink
            to="/login"
            className="rounded-full bg-stone-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-stone-700"
          >
            Accedi
          </NavLink>
        </nav>
      </div>
    </header>
  );
}