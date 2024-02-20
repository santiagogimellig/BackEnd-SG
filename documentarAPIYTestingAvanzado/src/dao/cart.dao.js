// Importo el modelo necesario desde un archivo local
import CartModel from "../models/cart.model.js";

// Defino y exporto la clase CartDao
export default class CartDao {
    // Método estático para obtener todos los carritos
    static async getAll() {
        return await CartModel.find(); // Obtengo todos los carritos utilizando el modelo de carrito
    }

    // Método estático para crear un nuevo carrito
    static async create(data = {}) {
        return await CartModel.create(data); // Creo un nuevo carrito utilizando los datos proporcionados y el modelo de carrito
    }

    // Método estático para obtener un carrito por su ID
    static async getById(cid) {
        return await CartModel.findById(cid); // Obtengo el carrito por su ID utilizando el modelo de carrito
    }

    // Método estático para actualizar un carrito por su ID
    static async updateById(cid, products) {
        // Actualizo el carrito por su ID con los nuevos productos utilizando el modelo de carrito
        return await CartModel.findOneAndUpdate({ _id: cid }, { $set: { products } }, { new: true });
    }

    // Método estático para eliminar un carrito por su ID
    static async deleteById(cid) {
        return await CartModel.deleteOne({ _id: cid }); // Elimino el carrito por su ID utilizando el modelo de carrito
    }
}