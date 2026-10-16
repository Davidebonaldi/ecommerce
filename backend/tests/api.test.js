import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import pool from "../src/config/db.js";

const email = `test_${Date.now()}@example.com`;
const password = "password123";
let token;

afterAll(async () => {
  await pool.query("DELETE FROM users WHERE email = ?", [email]);
  await pool.end();
});

describe("Sistema", () => {
  it("health check collegato al database", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.db).toBe("connected");
  });

  it("rotta inesistente risponde 404 JSON", async () => {
    const res = await request(app).get("/api/boh");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Risorsa non trovata");
  });
});

describe("Catalogo", () => {
  it("GET /api/products restituisce un array", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("prodotto inesistente risponde 404", async () => {
    const res = await request(app).get("/api/products/999999");
    expect(res.status).toBe(404);
  });
});

describe("Autenticazione", () => {
  it("rifiuta una email non valida", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test", email: "abc", password });
    expect(res.status).toBe(400);
  });

  it("rifiuta una password troppo corta", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test", email, password: "123" });
    expect(res.status).toBe(400);
  });

  it("registra un utente senza esporre l'hash", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test User", email, password });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.password_hash).toBeUndefined();
    expect(res.body.user.role).toBe("customer");
  });

  it("rifiuta una registrazione duplicata", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test User", email, password });
    expect(res.status).toBe(409);
  });

  it("login con password errata risponde 401", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "sbagliata123" });
    expect(res.status).toBe(401);
  });

  it("login corretto restituisce un token", async () => {
    const res = await request(app).post("/api/auth/login").send({ email, password });
    expect(res.status).toBe(200);
    token = res.body.token;
    expect(token).toBeTruthy();
  });
});

describe("Permessi", () => {
  it("il carrello richiede il login", async () => {
    const res = await request(app).get("/api/cart");
    expect(res.status).toBe(401);
  });

  it("il carrello è accessibile con token", async () => {
    const res = await request(app).get("/api/cart").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([]);
  });

  it("un customer non può creare prodotti", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({ category_id: 1, name: "X", price: 1 });
    expect(res.status).toBe(403);
  });

  it("un customer non accede all'area admin", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});