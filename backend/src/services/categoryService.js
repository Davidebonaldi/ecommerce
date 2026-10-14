import pool from "../config/db.js";

export async function getAllCategories() {
  const [rows] = await pool.query(
    "SELECT id, name, slug FROM categories ORDER BY name"
  );
  return rows;
}