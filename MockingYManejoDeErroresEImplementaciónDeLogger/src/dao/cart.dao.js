// Importo el modelo de carrito desde su respectivo archivo.
import CartModel from "../models/cart.model.js";

// Exporto la clase 'CartDao'.
export default class CartDao {
    // Método estático para obtener todos los carritos.
    static async getAll() {
        // Obtengo todos los carritos utilizando el modelo 'CartModel'.
        return await CartModel.find();
    }

    // Método estático para crear un nuevo carrito.
    static async create(data = {}) {
        // Creo un nuevo carrito utilizando el modelo 'CartModel' con los datos proporcionados.
        return await CartModel.create(data);
    }

    // Método estático para obtener un carrito por su ID.
    static async getById(cid) {
        // Obtengo el carrito por su ID utilizando el modelo 'CartModel'.
        return await CartModel.findById(cid);
    }

    // Método estático para actualizar un carrito por su ID.
    static async updateById(cid, products) {
        // Actualizo el carrito por su ID utilizando el modelo 'CartModel'.
        // Utilizo el método 'findOneAndUpdate' para buscar y actualizar el carrito y devuelvo el carrito actualizado.
        return await CartModel.findOneAndUpdate({ _id: cid }, { $set: { products } }, { new: true });
    }

    // Método estático para eliminar un carrito por su ID.
    static async deleteById(cid) {
        // Elimino el carrito por su ID utilizando el modelo 'CartModel'.
        return await CartModel.deleteOne({ _id: cid });
    }
}