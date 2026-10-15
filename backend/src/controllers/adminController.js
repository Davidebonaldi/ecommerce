import * as orderService from "../services/orderService.js";
import * as userService from "../services/userService.js";

function handleError(res, err, fallback) {
  res.status(err.status || 500).json({ message: err.status ? err.message : fallback });
}

export async function listOrders(req, res) {
  try {
    res.json(await orderService.getAllOrders({ status: req.query.status }));
  } catch (err) {
    handleError(res, err, "Errore nel recupero degli ordini");
  }
}

export async function getOrder(req, res) {
  try {
    const order = await orderService.getOrderById(req.params.id, null, true);
    if (!order) {
      return res.status(404).json({ message: "Ordine non trovato" });
    }
    res.json(order);
  } catch (err) {
    handleError(res, err, "Errore nel recupero dell'ordine");
  }
}

export async function updateOrderStatus(req, res) {
  try {
    res.json(await orderService.updateOrderStatus(req.params.id, req.body.status));
  } catch (err) {
    handleError(res, err, "Errore nell'aggiornamento dell'ordine");
  }
}

export async function listUsers(req, res) {
  try {
    res.json(await userService.getAllUsers());
  } catch (err) {
    handleError(res, err, "Errore nel recupero degli utenti");
  }
}

export async function updateUserRole(req, res) {
  try {
    if (Number(req.params.id) === req.user.id) {
      return res.status(400).json({ message: "Non puoi modificare il tuo stesso ruolo" });
    }
    res.json(await userService.updateUserRole(req.params.id, req.body.role));
  } catch (err) {
    handleError(res, err, "Errore nell'aggiornamento dell'utente");
  }
}

export async function deleteUser(req, res) {
  try {
    if (Number(req.params.id) === req.user.id) {
      return res.status(400).json({ message: "Non puoi eliminare il tuo stesso account" });
    }
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ message: "Impossibile eliminare: l'utente ha degli ordini" });
    }
    handleError(res, err, "Errore nell'eliminazione dell'utente");
  }
}