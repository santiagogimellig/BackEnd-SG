// Importo los servicios y controladores necesarios desde archivos locales
import CartsService from "../services/carts.services.js"; // Importo el servicio de carritos
import { Exception } from "../helpers/utils.js"; // Importo la clase Exception de utilidades
import UsersService from "../services/users.services.js"; // Importo el servicio de usuarios
import ProductsController from "./products.controller.js"; // Importo el controlador de productos
import TicketController from "./ticket.controller.js"; // Importo el controlador de tickets
import { getNewId } from "../helpers/utils.js"; // Importo la función getNewId de utilidades

// Defino y exporto la clase CartController
export default class CartController {
    // Método estático para obtener carritos
    static async get(filter = {}) {
        const carts = await CartsService.findAll(filter)
        return carts;
    }

    // Método estático para crear un carrito
    static async create(newCart = {}) {
        const cart = await CartsService.create(newCart)
        return cart;
    }

    // Método estático para obtener un carrito por su ID
    static async getById(cid) {
        return await CartsService.findById(cid)
    }

    // Método estático para eliminar un carrito por su ID
    static async deleteById(cid) {
        await CartController.getById(cid)
        req.logger.info("Eliminando el carrito");
        await CartsService.deleteById(cid);
        req.logger.info("Carrito eliminado correctamente");
    }

    // Método estático para agregar un producto a un carrito
    static async addProductToCart(cartId, productId, quantity) {
        try {
            console.log('entra al controlador');
            const user = await UsersService.findAll({ cartId })
            if (user[0].rol === 'admin') {
                throw new Exception('El admin no puede agregar productos al carrito', 401)
            }
            const cart = await CartController.getById(cartId)
            if (!cart) {
                throw new Exception('No se encontró el carrito', 404)
            }
            const existingProductIndex = cart.products.findIndex(
                (product) => String(product.productId._id) === String(productId)
            );
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += Number(quantity)
            } else {
                cart.products.push({ productId, quantity })
            }
            const updatedCart = await CartsService.updateById(cartId, cart.products)
            return updatedCart;
        } catch (error) {
            console.error("Error", error.message);
            throw new Exception("Error al agregar producto al carrito", 500)
        }
    }

    // Método estático para eliminar un producto de un carrito
    static async removeProductFromCart(cid, productId) {
        try {
            const cart = await CartController.getById(cid);
            if (!cart) {
                throw new Exception('No se encontró el carrito', 404)
            }
            const existingProductIndex = cart.products.findIndex(
                (product) => String(product.productId._id) === String(productId)
            );
            if (existingProductIndex !== -1) {
                cart.products.splice(existingProductIndex, 1)
                const updatedCart = await CartsService.updateById(cid, cart.products)
                return updatedCart;
            } else {
                throw new Exception('No se encontró el producto en el carrito', 404)
            }
        } catch (error) {
            throw new Exception("Error al eliminar el producto del carrito", 500)
        }
    }

    // Método estático para eliminar todos los productos de un carrito
    static async removeAllProductsFromCart(cid) {
        try {
            const cart = await CartController.getById(cid);
            if (!cart) {
                throw new Exception('No existe el carrito', 404);
            }
            cart.products = [];
            const updatedCart = await CartsService.updateById(cid, cart.products)
            return updatedCart;
        } catch (error) {
            throw new Exception('Error al eliminar los productos del carrito', 500)
        }
    }

    // Método estático para actualizar la cantidad de un producto en un carrito
    static async updateProductQuantityFromCart(cid, pid, quantity) {
        try {
            const cart = await CartsService.findById(cid);
            if (!cart) {
                throw new Exception('No existe el carrito', 404);
            }
            const existingProductIndex = cart.products.findIndex(
                (product) => String(product.productId) === String(pid)
            );
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity = Number(quantity)
            }
            const updatedCart = await CartsService.updateById(cid, cart.products)
            return updatedCart;
        } catch (error) {
            throw new Exception('Error al actualizar el producto del carrito', 500)
        }
    }

    // Método estático para actualizar los productos de un carrito
    static async updateProductsFromCart(cid, products) {
        try {
            const cart = await CartsService.findById(cid);
            if (!cart) {
                throw new Exception('No existe el carrito', 404);
            }
            await CartController.removeAllProductsFromCart(cid);
            console.log('carrito vacío')
            products.products.forEach(prod => {
                console.log("prod", prod)
                this.addProductToCart(cid, prod.productId, prod.quantity)
            })
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw new Exception('Error al actualizar los productos del carrito', 500)
        }
    }

    // Método estático para crear una compra a partir de un carrito
    static async createPurchase(cid) {
        const user = await UsersService.findAll({ cartId: cid });
        let amount = 0;
        if (user.length > 0) {
            let cart = await CartsService.findById({ _id: user[0].cartId });
            let productsWithoutStock = [];
            let productsWithStock = [];
            let updatedProducts;
            for (const [index, prod] of cart.products.entries()) {
                if (prod.productId.stock < prod.quantity) {
                    console.log('Stock insuficiente');
                    productsWithoutStock.push({ _id: prod.productId._id, quantity: prod.quantity });
                } else {
                    console.log('Hay stock');
                    productsWithStock.push({ _id: prod.productId._id, quantity: prod.quantity });
                    updatedProducts = await ProductsController.updateById(prod.productId._id, {
                        stock: prod.productId.stock - prod.quantity,
                    });
                    amount += prod.productId.price * prod.quantity;
                    cart = await CartController.removeProductFromCart(cid, prod.productId._id);
                }
            }
            const ticket = await TicketController.create({
                code: getNewId(),
                purchase_datetime: Date.now(),
                amount,
                purchaser: user[0].email,
            });
            return { user, productsWithoutStock, cart, ticket };
        }
    }
}
