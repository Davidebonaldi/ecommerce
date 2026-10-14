import * as cartService from "../services/cartService.js";

function handleError(res, err, fallback) {
  res.status(err.status || 500).json({ message: err.status ? err.message : fallback });
}

function validQuantity(q) {
  return Number.isInteger(q) && q > 0;
}

export async function getCart(req, res) {
  try {
    res.json(await cartService.getCart(req.user.id));
  } catch (err) {
    handleError(res, err, "Errore nel recupero del carrello");
  }
}

export async function addToCart(req, res) {
  try {
    const { product_id, quantity = 1 } = req.body;
    if (!product_id || !validQuantity(quantity)) {
      return res.status(400).json({ message: "product_id e quantity (intero > 0) sono obbligatori" });
    }
    res.status(201).json(await cartService.addToCart(req.user.id, product_id, quantity));
  } catch (err) {
    handleError(res, err, "Errore nell'aggiunta al carrello");
  }
}

export async function updateCartItem(req, res) {
  try {
    const { quantity } = req.body;
    if (!validQuantity(quantity)) {
      return res.status(400).json({ message: "quantity deve essere un intero maggiore di 0" });
    }
    res.json(await cartService.updateCartItem(req.user.id, req.params.id, quantity));
  } catch (err) {
    handleError(res, err, "Errore nell'aggiornamento del carrello");
  }
}

export async function removeCartItem(req, res) {
  try {
    res.json(await cartService.removeCartItem(req.user.id, req.params.id));
  } catch (err) {
    handleError(res, err, "Errore nella rimozione dall'articolo");
  }
}