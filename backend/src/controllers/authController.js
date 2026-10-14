import * as authService from "../services/authService.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nome, email e password sono obbligatori" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "La password deve avere almeno 8 caratteri" });
    }
    const result = await authService.registerUser({ name, email, password });
    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.status ? err.message : "Errore nella registrazione" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email e password sono obbligatorie" });
    }
    const result = await authService.loginUser({ email, password });
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.status ? err.message : "Errore nel login" });
  }
}