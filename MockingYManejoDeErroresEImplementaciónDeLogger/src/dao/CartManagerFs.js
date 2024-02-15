// Importo las funciones necesarias desde el archivo de utilidades y la clase ProductManagerFs desde su respectivo archivo.
import { getNewId, getJSONFromFile, saveJSONToFile } from '../utils/utils.js';
import { ProductManagerFs } from './ProductManagerFs.js';

// Defino la clase CartManagerFs.
export class CartManagerFs {
    constructor(pathCart) {
        // Almaceno la ruta del archivo de carritos.
        this.path = pathCart;
    }

    // Método para agregar un nuevo carrito.
    async addCart() {
        try {
            // Obtengo la lista de carritos desde el archivo.
            const cart = await getJSONFromFile(this.path);
            // Genero un nuevo ID para el carrito.
            let newCart = {
                id: getNewId(),
                products: []
            };
            // Agrego el nuevo carrito a la lista.
            cart.push(newCart);
            // Guardo la lista actualizada en el archivo.
            await saveJSONToFile(this.path, cart);
            // Devuelvo el nuevo carrito creado.
            return newCart;
        } catch (error) {
            // Si ocurre un error, lanzo una excepción.
            throw new Error(`Error ${error.message}`);
        }
    }

    // Método para obtener todos los carritos.
    async getCarts() {
        // Obtengo la lista de carritos desde el archivo.
        return getJSONFromFile(this.path);
    }

    // Método para obtener un carrito por su ID.
    async getCartById(id) {
        try {
            // Obtengo la lista de carritos desde el archivo.
            const carts = await getJSONFromFile(this.path);
            // Busco el carrito con el ID especificado.
            const foundCart = carts.find((c) => c.id === id);
            // Si se encuentra el carrito, lo devuelvo, de lo contrario, devuelvo un mensaje de error.
            return foundCart ? foundCart : `Cart with id ${id} doesn't exists`;
        } catch (error) {
            // Si ocurre un error, lanzo una excepción.
            throw new Error(error);
        }
    }

    // Método para agregar un producto a un carrito.
    async addProductToCart(cartId, { productId, quantity, pathProducts }) {
        try {
            // Obtengo la lista de carritos desde el archivo.
            const carts = await getJSONFromFile(this.path);
            // Busco el índice del carrito en la lista.
            let cartIndex = carts.findIndex(c => c.id === cartId);
            // Verifico si el carrito existe.
            if (cartIndex >= 0) {
                // Busco si el producto ya está en el carrito.
                let foundProduct = carts[cartIndex].products.find(element => element.productId === productId);
                // Si el producto no está en el carrito, lo agrego.
                if (!foundProduct) {
                    const productManager = new ProductManagerFs(pathProducts);
                    let product = await productManager.getProductById(productId);
                    // Verifico si el producto existe.
                    if (typeof product !== 'string') {
                        carts[cartIndex].products.push({ productId, quantity });
                    } else {
                        throw new Error(`Product with id ${productId} doesn't exists`);
                    }
                } else {
                    // Si el producto ya está en el carrito, actualizo la cantidad.
                    let foundIndex = carts[cartIndex].products.findIndex(prod => prod.productId === productId);
                    carts[cartIndex].products[foundIndex].quantity += quantity;
                }
                // Guardo la lista de carritos actualizada en el archivo.
                await saveJSONToFile(this.path, carts);
            } else {
                console.log(`Cart doesn't exists`);
            }
        } catch (error) {
            // Si ocurre un error, lanzo una excepción.
            throw new Error(`Something is wrong ${error.message}`);
        }
    }

    // Método para obtener los productos de un carrito por su ID.
    async getCartProducts(cartId) {
        try {
            // Obtengo el carrito por su ID.
            const cart = await this.getCartById(cartId);
            // Si el carrito existe, devuelvo sus productos, de lo contrario, devuelvo un mensaje de error.
            return typeof cart !== 'string' ? cart.products : { error: `Cart doesn't exists` };
        } catch (error) {
            // Si ocurre un error, lanzo una excepción.
            throw new Error(`Something is wrong ${error.message}`);
        }
    }
}