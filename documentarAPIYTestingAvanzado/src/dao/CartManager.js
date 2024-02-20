// Importo el modelo necesario desde un archivo local
import CartModel from "../models/cart.model.js";
// Importo la clase Exception desde un archivo local
import { Exception } from '../helpers/utils.js';

// Defino y exporto la clase CartManager
export default class CartManager {
    // Método estático para obtener todos los carritos
    static async get(query = {}) {
        // Defino los criterios de búsqueda
        const criteria = {};
        // Busco los carritos utilizando el modelo de carrito
        const result = await CartModel.find(criteria);
        return result; // Devuelvo los resultados obtenidos
    }

    // Método estático para obtener un carrito por su ID
    static async getById(cid) {
        // Busco el carrito por su ID utilizando el modelo de carrito
        const cart = await CartModel.findById(cid);
        if (!cart) {
            // Si no se encuentra el carrito, lanzo una excepción
            throw new Exception('No existe el carrito', 404);
        }
        return cart; // Devuelvo el carrito encontrado
    }

    // Método estático para crear un nuevo carrito
    static async create(newCart = {}) {
        try {
            // Intento crear un nuevo carrito utilizando los datos proporcionados y el modelo de carrito
            const cart = await CartModel.create(newCart);
            return cart; // Devuelvo el carrito creado
        } catch (error) {
            // Si ocurre un error durante la creación, lo manejo y lanzo una excepción
            console.error('Error al crear el carrito', error.message);
            throw new Exception("No se pudo crear el carrito ", 500);
        }
    }

    // Método estático para agregar un producto a un carrito
    static async addProductToCart(cartId, productId, quantity) {
        try {
            // Busco el carrito por su ID utilizando el modelo de carrito
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                // Si no se encuentra el carrito, lanzo una excepción
                throw new Exception('No se encontro el carrito', 404);
            }
            // Busco si el producto ya existe en el carrito
            const existingProductIndex = cart.products.findIndex(
                (product) => String(product.productId._id) === String(productId)
            );
            if (existingProductIndex !== -1) {
                // Si el producto ya existe, actualizo la cantidad
                cart.products[existingProductIndex].quantity += Number(quantity);
            } else {
                // Si el producto no existe, lo agrego al carrito
                cart.products.push({ productId, quantity });
            }
            // Guardo los cambios en el carrito
            const updatedCart = await cart.save();
            return updatedCart; // Devuelvo el carrito actualizado
        } catch (error) {
            // Si ocurre un error, lo manejo y lanzo una excepción
            console.error("Error", error.message);
            throw new Exception("Error al agregar producto al carrito", 500);
        }
    }

    // Método estático para eliminar un carrito por su ID
    static async deleteById(cid) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Exception('No existe el carrito', 404);
        }
        const criteria = { _id: cid };
        await CartModel.deleteOne(criteria)
        console.log('Carrito eliminado correctamente')
    }

    // Método estático para eliminar todos los productos de un carrito
    static async removeAllProductsFromCart(cid) {
        try {
            const cart = await CartModel.findById(cid);
            if (!cart) {
                throw new Exception('No existe el carrito', 404);
            }
            cart.products = [];
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw new Exception('Error al eliminar los productos del carrito', 500)
        }
    }

    // Método estático para actualizar los productos de un carrito
    static async updateProductsFromCart(cid, products) {
        try {
            const cart = await CartModel.findById(cid);
            if (!cart) {
                throw new Exception('No existe el carrito', 404);
            }
            await this.removeAllProductsFromCart(cid);
            products.forEach(prod => {
                this.addProductToCart(cid, prod.productId, prod.quantity)
            })
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw new Exception('Error al actualizar los productos del carrito', 500)
        }
    }

    // Método estático para actualizar la cantidad de un producto en un carrito
    static async updateProductQuantityFromCart(cid, pid, quantity) {
        try {
            const cart = await CartModel.findById(cid);
            if (!cart) {
                throw new Exception('No existe el carrito', 404);
            }
            const existingProductIndex = cart.products.findIndex(
                (product) => String(product.productId) === String(pid)
            );
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity = Number(quantity)
            }
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw new Exception('Error al actualizar el producto del carrito', 500)
        }
    }
}
