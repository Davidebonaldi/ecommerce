import pool from "../config/db.js";

export async function getAllCategories() {
  const [rows] = await pool.query(
    "SELECT id, name, slug FROM categories ORDER BY name"
  );
  return rows;
}

function slugify(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  
  export async function getCategoryById(id) {
    const [rows] = await pool.query(
      "SELECT id, name, slug FROM categories WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  }
  
  export async function createCategory({ name }) {
    const [result] = await pool.query(
      "INSERT INTO categories (name, slug) VALUES (?, ?)",
      [name, slugify(name)]
    );
    return getCategoryById(result.insertId);
  }
  
  export async function updateCategory(id, { name }) {
    const [result] = await pool.query(
      "UPDATE categories SET name = ?, slug = ? WHERE id = ?",
      [name, slugify(name), id]
    );
    if (result.affectedRows === 0) return null;
    return getCategoryById(id);
  }
  
  export async function deleteCategory(id) {
    const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }