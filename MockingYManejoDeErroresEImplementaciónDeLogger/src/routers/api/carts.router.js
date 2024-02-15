import { Router } from "express";
import CartManager from "../../dao/CartManager.js";
import CartController from "../../controllers/cart.controller.js"
import { authMiddleware, authorizationMiddleware } from "../../helpers/utils.js";
import UsersService from "../../services/users.services.js";
import CartsService from "../../services/carts.services.js";
import ProductsService from "../../services/products.service.js";
import passport from "passport";

// Se crea una nueva instancia de Router
const router = Router();

// Ruta para obtener todos los carritos
router.get('/', async (req, res) => {
    // Se obtienen todos los carritos utilizando el controlador correspondiente
    const carts = await CartController.get();
    // Se envía una respuesta con los carritos obtenidos
    res.status(200).json(carts);
});

// Ruta para obtener un carrito por su ID
router.get('/:cid', async (req, res) => {
    try {
        // Se obtiene el ID del carrito de los parámetros de la solicitud
        const { cid } = req.params;
        // Se obtiene el carrito utilizando el controlador correspondiente
        const cart = await CartController.getById(cid);
        // Se envía una respuesta con el carrito obtenido
        res.status(200).json(cart)
    } catch (error) {
        // Si ocurre un error, se envía una respuesta con el mensaje de error correspondiente
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})

// Ruta para agregar un producto al carrito
router.post('/:cartId', passport.authenticate('jwt', { session: false }), authorizationMiddleware('user'), async (req, res) => {
    try {
        // Se obtienen el ID del carrito y los datos del producto de la solicitud
        const { cartId } = req.params
        const { productId, quantity } = req.body;
        // Se añade el producto al carrito utilizando el controlador correspondiente
        const product = await CartController.addProductToCart(cartId, productId, quantity)
        // Se envía una respuesta con el producto añadido al carrito
        res.status(201).json(product)
    } catch (error) {
        // Si ocurre un error, se envía una respuesta con el mensaje de error correspondiente
        console.error(error.message)
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})

// Ruta para eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res, next) => {
    // Se obtienen los IDs del carrito y del producto de los parámetros de la solicitud
    const { cid, pid } = req.params
    try {
        // Se elimina el producto del carrito utilizando el controlador correspondiente
        const cart = await CartController.removeProductFromCart(cid, pid)
        // Se envía una respuesta con el carrito actualizado después de eliminar el producto
        res.status(200).send(cart)
    } catch (error) {
        // Si ocurre un error, se pasa al siguiente middleware para manejarlo
        next(error)
    }
})

// Ruta para eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    // Se obtiene el ID del carrito de los parámetros de la solicitud
    const { cid } = req.params;
    try {
        // Se eliminan todos los productos del carrito utilizando el controlador correspondiente
        const cart = await CartController.removeAllProductsFromCart(cid)
        // Se envía una respuesta con el carrito actualizado después de eliminar todos los productos
        res.status(201).send(cart)
    } catch (error) {
        // Si ocurre un error, se envía una respuesta con el mensaje de error correspondiente
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})

// Ruta para actualizar los productos del carrito
router.put('/:cid', async (req, res) => {
    // Se obtiene el ID del carrito de los parámetros de la solicitud
    const { cid } = req.params;
    // Se obtienen los datos de los productos de la solicitud
    const products = req.body;
    try {
        // Se actualizan los productos del carrito utilizando el controlador correspondiente
        const cart = await CartController.updateProductsFromCart(cid, products)
        // Se envía una respuesta con el carrito actualizado después de la actualización de los productos
        res.status(201).send(cart)
    } catch (error) {
        // Si ocurre un error, se envía una respuesta con el mensaje de error correspondiente
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})

// Ruta para actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    // Se obtienen los IDs del carrito y del producto de los parámetros de la solicitud
    const { cid, pid } = req.params;
    // Se obtiene la cantidad del producto de la solicitud
    const { quantity } = req.body;
    try {
        // Se actualiza la cantidad del producto en el carrito utilizando el controlador correspondiente
        const cart = await CartManager.updateProductQuantityFromCart(cid, pid, quantity)
        // Se envía una respuesta con el carrito actualizado después de la actualización de la cantidad del producto
        res.status(200).send(cart)
    } catch (error) {
        // Si ocurre un error, se envía una respuesta con el mensaje de error correspondiente
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})

// Ruta para realizar la compra de los productos en el carrito
router.post('/:cid/purchase', async (req, res, next) => {
    // Se obtiene el ID del carrito de los parámetros de la solicitud
    const { cid } = req.params;
    try {
        // Se crea la compra de los productos en el carrito utilizando el controlador correspondiente
        const { user, productsWithoutStock, cart, ticket } = await CartController.createPurchase(cid)
        // Se envía una respuesta con los datos de la compra realizada
        res.status(200).json({
            user,
            productsWithoutStock,
            cart,
            ticket
        })
    } catch (error) {
        // Si ocurre un error, se pasa al siguiente middleware para manejarlo
        console.error("Error", error.message);
        next(error);
    }
})

// Se exporta el enrutador para su uso en otras partes de la aplicación
export default router;
