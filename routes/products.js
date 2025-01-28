const express = require("express");
const ProductManager = require("../managers/ProductManager");

const router = express.Router();
const productManager = new ProductManager("./data/products.json");

//ruta para levantar productos
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

//ruta para agregar nuevo producto
router.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  //verificacion
  if (!title || !description || !code || !price || !stock || !category) {
    return (
      res.status(400), express.json({ error: "Faltan campos obligatorios" })
    );
  }

  const newProduct = {
    title,
    description,
    code,
    price,
    status: status ?? true,
    stock,
    category,
    thumbnails: thumbnails || [],
  };

  const product = await productManager.addProduct(newProduct);
  res.status(201).json(product);
});

//buscar prodcto por ID
router.get("/:pid", async (req, res) => {
  const product = await productManager.getProductById(parseInt(req.params.pid));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

//actualizar producto por ID
router.put("/:pid", async (req, res) => {
  const updateProduct = await productManager.updateProduct(
    parseInt(req.params.pid),
    req.body
  );
  if (updateProduct) {
    res.json(updateProduct);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

//Eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
  const result = await productManager.deleteProduct(parseInt(req.params.pid));
  if (result) {
    res.status(200).json({ message: "Producto eliminado correctamente" }); // Respuesta con mensaje
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

module.exports = router;
