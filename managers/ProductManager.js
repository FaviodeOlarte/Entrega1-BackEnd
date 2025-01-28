const { json } = require("express");

const fs = require("fs").promises;

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer los productos", error);
      return [];
    }
  }

  async getProductById(pid) {
    const products = await this.getProducts();
    return products.find((product) => product.id === pid);
  }

  async updateProduct(pid, updatedData) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id === pid);
      if (index === -1) {
        return null;
      }
      const updateProduct = { ...products[index], ...updatedData };
      products[index] = updateProduct;

      //guardo los cambios
      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return updateProduct;
    } catch (error) {
      console.error("Error al actualizar el producto", error);
      return null;
    }
  }

  async deleteProduct(pid) {
    try {
      let products = await this.getProducts();
      const index = products.findIndex((product) => product.id === pid);
      if (index === -1) {
        return null;
      }

      //eliminar el producto
      products = products.filter((product) => product.id !== pid);

      //guardo el cambio
      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return true; //respuesta si fue borrado correctamente
    } catch (error) {
      console.error("Error al eliminar producto", error);
      return false;
    }
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();
      const id = products.length ? products[products.length - 1].id + 1 : 1;
      const newProduct = { id, ...product };

      products.push(newProduct);

      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      return null;
    }
  }
}

module.exports = ProductManager;
