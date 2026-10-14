import pool from "../config/db.js";

export async function getCart(userId) {
  const [rows] = await pool.query(
    `SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.price,
            p.image_url, p.stock,
            (ci.quantity * p.price) AS subtotal
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.user_id = ?
     ORDER BY ci.created_at DESC`,
    [userId]
  );
  const total = rows.reduce((sum, r) => sum + Number(r.subtotal), 0);
  return { items: rows, total: Number(total.toFixed(2)) };
}

export async function addToCart(userId, productId, quantity = 1) {
  const [products] = await pool.query(
    "SELECT stock FROM products WHERE id = ?",
    [productId]
  );
  if (products.length === 0) {
    const err = new Error("Prodotto non trovato");
    err.status = 404;
    throw err;
  }

  const [existing] = await pool.query(
    "SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ?",
    [userId, productId]
  );
  const newQuantity = (existing[0]?.quantity || 0) + quantity;

  if (newQuantity > products[0].stock) {
    const err = new Error("Quantità superiore alla disponibilità");
    err.status = 400;
    throw err;
  }

  await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = ?`,
    [userId, productId, quantity, newQuantity]
  );
  return getCart(userId);
}

export async function updateCartItem(userId, itemId, quantity) {
  const [rows] = await pool.query(
    `SELECT p.stock FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.id = ? AND ci.user_id = ?`,
    [itemId, userId]
  );
  if (rows.length === 0) {
    const err = new Error("Articolo non trovato nel carrello");
    err.status = 404;
    throw err;
  }
  if (quantity > rows[0].stock) {
    const err = new Error("Quantità superiore alla disponibilità");
    err.status = 400;
    throw err;
  }

  await pool.query(
    "UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?",
    [quantity, itemId, userId]
  );
  return getCart(userId);
}

export async function removeCartItem(userId, itemId) {
  const [result] = await pool.query(
    "DELETE FROM cart_items WHERE id = ? AND user_id = ?",
    [itemId, userId]
  );
  if (result.affectedRows === 0) {
    const err = new Error("Articolo non trovato nel carrello");
    err.status = 404;
    throw err;
  }
  return getCart(userId);
}