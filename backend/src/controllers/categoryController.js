import * as categoryService from "../services/categoryService.js";

export async function getCategories(req, res) {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero delle categorie" });
  }
}