import * as orderService from "../services/orderService.js";

function handleError(res, err, fallback) {
  res.status(err.status || 500).json({ message: err.status ? err.message : fallback });
}

export async function createOrder(req, res) {
  try {
    const { shipping_address } = req.body;
    if (!shipping_address || !shipping_address.trim()) {
      return res.status(400).json({ message: "L'indirizzo di spedizione è obbligatorio" });
    }
    const order = await orderService.createOrder(req.user.id, shipping_address.trim());
    res.status(201).json(order);
  } catch (err) {
    handleError(res, err, "Errore nella creazione dell'ordine");
  }
}

export async function getOrders(req, res) {
  try {
    res.json(await orderService.getUserOrders(req.user.id));
  } catch (err) {
    handleError(res, err, "Errore nel recupero degli ordini");
  }
}

export async function getOrder(req, res) {
  try {
    const order = await orderService.getOrderById(
      req.params.id,
      req.user.id,
      req.user.role === "admin"
    );
    if (!order) {
      return res.status(404).json({ message: "Ordine non trovato" });
    }
    res.json(order);
  } catch (err) {
    handleError(res, err, "Errore nel recupero dell'ordine");
  }
}