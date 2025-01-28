const fs = require("fs").promises;

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer carrito:", error);
      return [];
    }
  }

  async createCart() {
    try {
      const carts = await this.getCarts();
      const id = carts.length ? carts[carts.length - 1].id + 1 : 1;
      const newCart = { id, products: [] };
      carts.push(newCart);
      await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      return null;
    }
  }

  async addProductToCart(cid, pid, quantity) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((cart) => cart.id === cid);
      if (!cart) return null;

      const productIndex = cart.products.findIndex(
        (product) => product.id === pid
      );
      if (productIndex === -1) {
        cart.products.push({ id: pid, quantity });
      } else {
        cart.products[productIndex].quantity += quantity;
      }

      await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
      return cart;
    } catch (error) {
      console.error("Error el agregar producto al carrito", error);
      return null;
    }
  }

  async getCartByID(cid) {
    try {
      const carts = await this.getCarts();
      return carts.find((cart) => cart.id === cid);
    } catch (error) {
      console.error("Error al obtener el carrito", error);
      return null;
    }
  }
}

module.exports = CartManager;
