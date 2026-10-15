import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-stone-900" : "text-stone-500 hover:text-stone-900"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold tracking-tight">
          shop<span className="text-indigo-600">.</span>
        </Link>
        <nav className="flex items-center gap-6">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/products" className={linkClass}>Prodotti</NavLink>
          <NavLink to="/cart" className={linkClass}>
            Carrello
            {count > 0 && (
              <span className="ml-1.5 rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">{count}</span>
            )}
          </NavLink>
          {user ? (
            <>
              <span className="text-sm text-stone-500">Ciao, {user.name.split(" ")[0]}</span>
              <button onClick={logout}
                className="rounded-full border border-stone-300 px-4 py-1.5 text-sm font-medium hover:bg-stone-100">
                Esci
              </button>
            </>
          ) : (
            <NavLink to="/login"
              className="rounded-full bg-stone-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-stone-700">
              Accedi
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}