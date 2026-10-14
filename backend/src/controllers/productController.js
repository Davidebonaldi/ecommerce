import * as productService from "../services/productService.js";

export async function getProducts(req, res) {
  try {
    const { search, category } = req.query;
    const products = await productService.getAllProducts({ search, category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero dei prodotti" });
  }
}

export async function getProduct(req, res) {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Prodotto non trovato" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero del prodotto" });
  }
}

export async function createProduct(req, res) {
    try {
      const { category_id, name, price } = req.body;
      if (!category_id || !name || price === undefined) {
        return res.status(400).json({ message: "category_id, name e price sono obbligatori" });
      }
      if (Number(price) < 0) {
        return res.status(400).json({ message: "Il prezzo non può essere negativo" });
      }
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (err) {
      if (err.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({ message: "Categoria inesistente" });
      }
      res.status(500).json({ message: "Errore nella creazione del prodotto" });
    }
  }
  
  export async function updateProduct(req, res) {
    try {
      const { category_id, name, price } = req.body;
      if (!category_id || !name || price === undefined) {
        return res.status(400).json({ message: "category_id, name e price sono obbligatori" });
      }
      const product = await productService.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ message: "Prodotto non trovato" });
      }
      res.json(product);
    } catch (err) {
      if (err.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({ message: "Categoria inesistente" });
      }
      res.status(500).json({ message: "Errore nell'aggiornamento del prodotto" });
    }
  }
  
  export async function deleteProduct(req, res) {
    try {
      const deleted = await productService.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Prodotto non trovato" });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Errore nell'eliminazione del prodotto" });
    }
  }