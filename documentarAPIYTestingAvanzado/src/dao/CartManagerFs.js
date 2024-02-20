// Importo las funciones necesarias desde un archivo local de utilidades
import { getNewId, getJSONFromFile, saveJSONToFile } from '../utils/utils.js'
// Importo la clase ProductManagerFs desde un archivo local
import { ProductManagerFs } from './ProductManagerFs.js'

// Defino y exporto la clase CartManagerFs
export class CartManagerFs {
    // Constructor de la clase que recibe la ruta del archivo de carritos
    constructor(pathCart) {
        this.path = pathCart;
    }

    // Método para agregar un nuevo carrito
    async addCart() {
        try {
            // Obtengo la lista de carritos desde el archivo
            const cart = await getJSONFromFile(this.path)
            // Creo un nuevo carrito con un ID único y una lista vacía de productos
            let newCart = {
                id: getNewId(),
                products: []
            }
            // Agrego el nuevo carrito a la lista de carritos
            cart.push(newCart)
            // Guardo la lista de carritos actualizada en el archivo
            await saveJSONToFile(this.path, cart)
            return newCart; // Devuelvo el nuevo carrito creado
        } catch (error) {
            throw new Error(`Error ${error.message}`) // Manejo de errores
        }
    }

    // Método para obtener todos los carritos
    async getCarts() {
        return getJSONFromFile(this.path); // Devuelve la lista de carritos del archivo
    }

    // Método para obtener un carrito por su ID
    async getCartById(id) {
        try {
            // Obtengo la lista de carritos desde el archivo
            const carts = await getJSONFromFile(this.path);
            // Busco el carrito con el ID especificado
            const findedCart = carts.find((c) => c.id === id)
            return findedCart // Devuelve el carrito encontrado o un mensaje de error si no se encuentra
                ? findedCart
                : `Cart with id ${id} doesn't exists`
        } catch (error) {
            throw new Error(error) // Manejo de errores
        }
    }

    // Método para agregar un producto a un carrito
    async addProductToCart(cartId, { productId, quantity, pathProducts }) {
        try {
            // Obtengo la lista de carritos desde el archivo
            const carts = await getJSONFromFile(this.path)
            // Busco el índice del carrito en la lista
            let cartIndex = carts.findIndex(c => c.id === cartId)
            if (cartIndex >= 0) {
                // Verifico si el producto ya está en el carrito
                let findedProduct = carts[cartIndex].products.find(element => element.productId === productId)
                if (!findedProduct) {
                    // Si el producto no está en el carrito, lo agrego
                    const productManager = new ProductManagerFs(pathProducts)
                    let product = await productManager.getProductById(productId)
                    if (typeof product !== 'string') {
                        carts[cartIndex].products.push({ productId, quantity })
                    } else {
                        throw new Error(`Product with id ${productId} doesn't exists`)
                    }
                } else {
                    // Si el producto ya está en el carrito, actualizo la cantidad
                    let findedIndex = carts[cartIndex].products.findIndex(prod => prod.productId === productId)
                    carts[cartIndex].products[findedIndex].quantity += quantity
                }
                // Guardo los cambios en la lista de carritos
                await saveJSONToFile(this.path, carts)
            } else {
                console.log(`Cart doesn't exists`)
            }
        } catch (error) {
            throw new Error(`Something is wrong ${error.message}`) // Manejo de errores
        }
    }

    // Método para obtener los productos de un carrito por su ID
    async getCartProducts(cartId) {
        try {
            // Obtengo el carrito por su ID
            const cart = await this.getCartById(cartId)
            return typeof cart !== 'string' ? cart.products : { error: `Cart doesn't exists` } // Devuelve los productos del carrito o un mensaje de error si el carrito no existe
        } catch (error) {
            throw new Error(`Something is wrong ${error.message}`) // Manejo de errores
        }
    }
}