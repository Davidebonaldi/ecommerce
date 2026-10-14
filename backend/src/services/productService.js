import pool from "../config/db.js";

export async function getAllProducts({ search, category } = {}) {
  let sql = `
    SELECT p.id, p.name, p.description, p.price, p.stock, p.image_url,
           c.id AS category_id, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    sql += " AND p.name LIKE ?";
    params.push(`%${search}%`);
  }
  if (category) {
    sql += " AND c.slug = ?";
    params.push(category);
  }

  sql += " ORDER BY p.created_at DESC";
  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function getProductById(id) {
  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.description, p.price, p.stock, p.image_url,
            c.id AS category_id, c.name AS category_name, c.slug AS category_slug
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0] || null;
}