import { useEffect, useState } from "react";
import { api, formatPrice } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const empty = { category_id: "", name: "", description: "", price: "", stock: 0, image_url: "" };
const inputClass =
  "w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500";

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setProducts(await api("/products"));
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
    api("/categories").then(setCategories).catch(() => {});
  }, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const body = {
      ...form,
      category_id: Number(form.category_id),
      price: Number(form.price),
      stock: Number(form.stock),
      image_url: form.image_url || null,
    };
    try {
      if (editingId) {
        await api(`/products/${editingId}`, { method: "PUT", body, token });
      } else {
        await api("/products", { method: "POST", body, token });
      }
      setForm(empty);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      category_id: p.category_id,
      name: p.name,
      description: p.description || "",
      price: p.price,
      stock: p.stock,
      image_url: p.image_url || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("Eliminare questo prodotto?")) return;
    setError("");
    try {
      await api(`/products/${id}`, { method: "DELETE", token });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Prodotti</h1>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 sm:grid-cols-2">
        <input required value={form.name} onChange={set("name")} placeholder="Nome" className={inputClass} />
        <select required value={form.category_id} onChange={set("category_id")} className={inputClass}>
          <option value="">Categoria...</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input required type="number" step="0.01" min="0" value={form.price} onChange={set("price")} placeholder="Prezzo" className={inputClass} />
        <input required type="number" min="0" value={form.stock} onChange={set("stock")} placeholder="Stock" className={inputClass} />
        <input value={form.image_url} onChange={set("image_url")} placeholder="URL immagine (facoltativo)" className={`${inputClass} sm:col-span-2`} />
        <textarea value={form.description} onChange={set("description")} placeholder="Descrizione" rows={3} className={`${inputClass} sm:col-span-2`} />
        <div className="flex gap-2 sm:col-span-2">
          <button className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            {editingId ? "Salva modifiche" : "Aggiungi prodotto"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(empty); }}
              className="rounded-full border border-stone-300 px-6 py-2 text-sm font-medium hover:bg-stone-100">
              Annulla
            </button>
          )}
        </div>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 text-stone-500">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Prezzo</th>
              <th className="p-3">Stock</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-stone-100 last:border-0">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{p.category_name}</td>
                <td className="p-3">{formatPrice(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="space-x-3 p-3 text-right">
                  <button onClick={() => startEdit(p)} className="text-indigo-600 hover:underline">Modifica</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}