import pool from "../config/db.js";

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export async function getAllUsers() {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.role, u.created_at,
            COUNT(o.id) AS orders_count
     FROM users u
     LEFT JOIN orders o ON o.user_id = u.id
     GROUP BY u.id
     ORDER BY u.created_at DESC`
  );
  return rows;
}

export async function updateUserRole(userId, role) {
  if (!["customer", "admin"].includes(role)) {
    throw httpError(400, "Ruolo non valido");
  }
  const [result] = await pool.query("UPDATE users SET role = ? WHERE id = ?", [role, userId]);
  if (result.affectedRows === 0) {
    throw httpError(404, "Utente non trovato");
  }
  const [rows] = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
    [userId]
  );
  return rows[0];
}

export async function deleteUser(userId) {
  const [result] = await pool.query("DELETE FROM users WHERE id = ?", [userId]);
  if (result.affectedRows === 0) {
    throw httpError(404, "Utente non trovato");
  }
}