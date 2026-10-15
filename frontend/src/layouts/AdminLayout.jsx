import { NavLink, Outlet } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `block rounded-xl px-4 py-2 text-sm font-medium ${
    isActive ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"
  }`;

export default function AdminLayout() {
  return (
    <div className="grid gap-8 md:grid-cols-[200px_1fr]">
      <aside>
        <h2 className="mb-3 px-4 text-xs font-semibold uppercase tracking-wide text-stone-400">
          Admin
        </h2>
        <nav className="space-y-1">
          <NavLink to="/admin" end className={linkClass}>Prodotti</NavLink>
          <NavLink to="/admin/categories" className={linkClass}>Categorie</NavLink>
          <NavLink to="/admin/orders" className={linkClass}>Ordini</NavLink>
          <NavLink to="/admin/users" className={linkClass}>Utenti</NavLink>
        </nav>
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  );
}