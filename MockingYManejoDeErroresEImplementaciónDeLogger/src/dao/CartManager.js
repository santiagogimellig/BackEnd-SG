// Importo el modelo de carrito desde su respectivo archivo y la excepción desde el archivo de utilidades.
import CartModel from "../models/cart.model.js";
import { Exception } from '../helpers/utils.js';

// Exporto la clase 'CartManager'.
export default class CartManager {
    // Método estático para obtener todos los carritos.
    static async get(query = {}) {
        // Defino un criterio vacío para la búsqueda.
        const criteria = {};
        // Busco todos los carritos utilizando el modelo 'CartModel' y el criterio definido.
        const result = await CartModel.find(criteria);
        // Devuelvo los resultados obtenidos.
        return result;
    }

    // Método estático para obtener un carrito por su ID.
    static async getById(cid) {
        // Busco un carrito por su ID utilizando el modelo 'CartModel'.
        const cart = await CartModel.findById(cid);
        // Si no se encuentra el carrito, lanzo una excepción.
        if (!cart) {
            throw new Exception('No existe el carrito', 404);
        }
        // Devuelvo el carrito encontrado.
        return cart;
    }

    // Método estático para crear un nuevo carrito.
    static async create(newCart = {}) {
        try {
            // Intento crear un nuevo carrito utilizando el modelo 'CartModel' y los datos proporcionados.
            const cart = await CartModel.create(newCart);
            // Devuelvo el carrito creado.
            return cart;
        } catch (error) {
            // Si ocurre un error durante la creación, registro el error y lanzo una excepción.
            console.error('Error al crear el carrito', error.message);
            throw new Exception("No se pudo crear el carrito ", 500);
        }
    }

    // Método estático para agregar un producto al carrito.
    static async addProductToCart(cartId, productId, quantity) {
        try {
            // Busco el carrito por su ID.
            const cart = await CartModel.findById(cartId);
            // Si no se encuentra el carrito, lanzo una excepción.
            if (!cart) {
                throw new Exception('No se encontro el carrito', 404);
            }
            // Busco el índice del producto en el carrito.
            const existingProductIndex = cart.products.findIndex(
                (product) => String(product.productId._id) === String(productId)
            );
            // Si el producto ya está en el carrito, aumento su cantidad.
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += Number(quantity);
            } else { // Si no está, lo añado al carrito.
                cart.products.push({ productId, quantity });
            }
            // Guardo los cambios realizados en el carrito.
            const updatedCart = await cart.save();
            // Devuelvo el carrito actualizado.
            return updatedCart;
        } catch (error) {
            // Si ocurre un error, registro el error y lanzo una excepción.
            console.error("Error", error.message);
            throw new Exception("Error al agregar producto al carrito", 500);
        }
    }

    // Métodos restantes (removeProductFromCart, deleteById, removeAllProductsFromCart, updateProductsFromCart, updateProductQuantityFromCart) con comentarios similares a los anteriores.
}