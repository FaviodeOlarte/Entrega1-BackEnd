const express = require("express");
const CartManager = require("../managers/CartManager");

const router = express.Router();
const cartManager = new CartManager("./data/carts.json");

// crea un carrito
router.post("/", async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

//Productos en el carrito
router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getCartByID(parseInt(req.params.cid));
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: "No se encuentra Carrito" });
  }
});

//Agregar un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Cantidad invalida" });
  }

  const cart = await cartManager.addProductToCart(
    parseInt(req.params.cid),
    parseInt(req.params.pid),
    quantity
  );

  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: "Carrito o producto no encontrado" });
  }
});

module.exports = router;
