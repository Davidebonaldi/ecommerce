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