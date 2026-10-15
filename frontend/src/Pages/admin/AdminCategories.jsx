import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function AdminCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setCategories(await api("/categories"));
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api(`/categories/${editingId}`, { method: "PUT", body: { name }, token });
      } else {
        await api("/categories", { method: "POST", body: { name }, token });
      }
      setName("");
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Eliminare questa categoria?")) return;
    setError("");
    try {
      await api(`/categories/${id}`, { method: "DELETE", token });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Categorie</h1>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome categoria"
          className="w-full max-w-xs rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500" />
        <button className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          {editingId ? "Salva" : "Aggiungi"}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setName(""); }}
            className="rounded-full border border-stone-300 px-4 py-2 text-sm hover:bg-stone-100">
            Annulla
          </button>
        )}
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <ul className="mt-6 divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-stone-400">{c.slug}</p>
            </div>
            <div className="space-x-3 text-sm">
              <button onClick={() => { setEditingId(c.id); setName(c.name); }} className="text-indigo-600 hover:underline">Modifica</button>
              <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline">Elimina</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}