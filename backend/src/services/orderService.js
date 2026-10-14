import pool from "../config/db.js";

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export async function createOrder(userId, shippingAddress) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Legge il carrello e blocca le righe dei prodotti (evita vendite doppie dello stesso stock)
    const [items] = await conn.query(
      `SELECT ci.product_id, ci.quantity, p.name, p.price, p.stock
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = ?
       FOR UPDATE`,
      [userId]
    );

    if (items.length === 0) {
      throw httpError(400, "Il carrello è vuoto");
    }

    for (const item of items) {
      if (item.quantity > item.stock) {
        throw httpError(400, `Stock insufficiente per "${item.name}"`);
      }
    }

    const total = items.reduce((sum, i) => sum + i.quantity * Number(i.price), 0);

    const [orderResult] = await conn.query(
      "INSERT INTO orders (user_id, total, shipping_address) VALUES (?, ?, ?)",
      [userId, total.toFixed(2), shippingAddress]
    );
    const orderId = orderResult.insertId;

    for (const item of items) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.name, item.price, item.quantity]
      );
      await conn.query(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [item.quantity, item.product_id]
      );
    }

    await conn.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);

    await conn.commit();
    return getOrderById(orderId, userId, false);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function getUserOrders(userId) {
  const [rows] = await pool.query(
    `SELECT id, total, status, shipping_address, created_at
     FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

// Se isAdmin è true, può leggere qualsiasi ordine; altrimenti solo i propri
export async function getOrderById(orderId, userId, isAdmin) {
  const [orders] = await pool.query(
    isAdmin
      ? "SELECT * FROM orders WHERE id = ?"
      : "SELECT * FROM orders WHERE id = ? AND user_id = ?",
    isAdmin ? [orderId] : [orderId, userId]
  );
  if (orders.length === 0) return null;

  const [items] = await pool.query(
    `SELECT id, product_id, product_name, unit_price, quantity,
            (unit_price * quantity) AS subtotal
     FROM order_items WHERE order_id = ?`,
    [orderId]
  );
  return { ...orders[0], items };
}