// Importo los servicios necesarios desde sus respectivos archivos.
import CartsService from "../services/carts.services.js";
import UsersService from "../services/users.services.js";
import ProductsController from "./products.controller.js";
import TicketController from "./ticket.controller.js";
import { getNewId } from "../helpers/utils.js"; // Importo la función 'getNewId' desde el archivo de utilidades.

// Exporto la clase 'CartController'.
export default class CartController {
    // Método estático para obtener carritos con filtros opcionales.
    static async get(filter = {}) {
        const carts = await CartsService.findAll(filter)
        return carts;
    }

    // Método estático para crear un nuevo carrito.
    static async create(newCart = {}) {
        const cart = await CartsService.create(newCart)
        return cart;
    }

    // Método estático para obtener un carrito por su ID.
    static async getById(cid) {
        return await CartsService.findById(cid)
    }

    // Método estático para eliminar un carrito por su ID.
    static async deleteById(cid) {
        await CartController.getById(cid)
        req.logger.info("Eliminando el carrito");
        await CartsService.deleteById(cid);
        req.logger.info("Carrito eliminado correctamente");
    }

    // Método estático para agregar un producto al carrito.
    static async addProductToCart(cartId, productId, quantity) {
        try {
            // Verifico si el usuario asociado al carrito tiene rol de administrador.
            const user = await UsersService.findAll({ cartId })
            if (user[0].rol === 'admin') {
                throw new Exception('El admin no puede agregar productos al carrito', 401)
            }
            // Obtengo el carrito por su ID.
            const cart = await CartController.getById(cartId)
            if (!cart) {
                throw new Exception('No se encontro el carrito', 404)
            }
            // Verifico si el producto ya está en el carrito.
            const existingProductIndex = cart.products.findIndex(
                (product) => String(product.productId._id) === String(productId)
            );
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += Number(quantity)
            } else {
                cart.products.push({ productId, quantity })
            }
            // Actualizo el carrito con el nuevo producto.
            const updatedCart = await CartsService.updateById(cartId, cart.products)
            return updatedCart;
        } catch (error) {
            console.error("Error", error.message);
            throw new Exception("Error al agregar producto al carrito", 500)
        }
    }

    // Métodos estáticos para realizar acciones sobre productos del carrito...
    
    // Métodos estáticos para realizar acciones sobre todos los productos del carrito...
    
    // Método estático para crear una compra.
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
