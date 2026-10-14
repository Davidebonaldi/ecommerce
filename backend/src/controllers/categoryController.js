import * as categoryService from "../services/categoryService.js";

export async function getCategories(req, res) {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero delle categorie" });
  }
}

export async function createCategory(req, res) {
    try {
      const { name } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ message: "Il nome è obbligatorio" });
      }
      const category = await categoryService.createCategory({ name: name.trim() });
      res.status(201).json(category);
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Categoria già esistente" });
      }
      res.status(500).json({ message: "Errore nella creazione della categoria" });
    }
  }
  
  export async function updateCategory(req, res) {
    try {
      const { name } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ message: "Il nome è obbligatorio" });
      }
      const category = await categoryService.updateCategory(req.params.id, { name: name.trim() });
      if (!category) {
        return res.status(404).json({ message: "Categoria non trovata" });
      }
      res.json(category);
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Categoria già esistente" });
      }
      res.status(500).json({ message: "Errore nell'aggiornamento della categoria" });
    }
  }
  
  export async function deleteCategory(req, res) {
    try {
      const deleted = await categoryService.deleteCategory(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Categoria non trovata" });
      }
      res.status(204).send();
    } catch (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(409).json({ message: "Impossibile eliminare: la categoria contiene ancora dei prodotti" });
      }
      res.status(500).json({ message: "Errore nell'eliminazione della categoria" });
    }
  }