// Importaciones de módulos y servicios necesarios
import { Router } from "express";
import CartManager from "../../dao/CartManager.js";
import CartController from "../../controllers/cart.controller.js"
import { authMiddleware, authorizationMiddleware } from "../../helpers/utils.js";
import UsersService from "../../services/users.services.js";
import CartsService from "../../services/carts.services.js";
import ProductsService from "../../services/products.service.js";
import passport from "passport";
import mongoose from "mongoose";

// Creación de un router de Express
const router = Router();

// Ruta para obtener todos los carritos
router.get('/', async (req, res) => {
    const carts = await CartController.get();
    res.status(200).json(carts);
});

// Ruta para obtener un carrito por su ID
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartController.getById(cid);
        res.status(200).json(cart)
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})

// Ruta para agregar un producto al carrito
router.post('/:cid', passport.authenticate('jwt', { session: false }), authorizationMiddleware(['user', 'premium']), async (req, res) => {
    try {
        const { cid } = req.params
        const { productId, quantity } = req.body;
        if (req.user.rol === 'premium') {
            const product = await ProductsService.findById(productId);
            const uid = new mongoose.Types.ObjectId(req.user.id);
            if (product.owner == uid) {
                return res.status(400).json({ error: 'No se puede agregar un producto al carrito del cual se es propietario.' })
            }
        }
        const product = await CartController.addProductToCart(cid, productId, quantity)
        res.status(201).json(product)
    } catch (error) {
        console.error(error.message)
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})

// Ruta para eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res, next) => {
    const { cid, pid } = req.params
    try {
        const cart = await CartController.removeProductFromCart(cid, pid)
        res.status(200).send(cart)
    } catch (error) {
        next(error)
    }
})

// Ruta para vaciar el carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await CartController.removeAllProductsFromCart(cid)
        res.status(201).send(cart)
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})

// Ruta para actualizar los productos en el carrito
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const products = req.body;
    try {
        const cart = await CartController.updateProductsFromCart(cid, products)
        res.status(201).send(cart)
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})

// Ruta para actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await CartManager.updateProductQuantityFromCart(cid, pid, quantity)
        res.status(200).send(cart)
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})

// Ruta para realizar una compra
router.post('/:cid/purchase', async (req, res, next) => {
    const { cid } = req.params;
    try {
        const { user, productsWithoutStock, cart, ticket } = await CartController.createPurchase(cid)
        res.status(200).json({
            user,
            productsWithoutStock,
            cart,
            ticket
        })
    } catch (error) {
        console.error("Error", error.message);
        next(error);
    }
})

// Exportación del router para su uso en otras partes de la aplicación
export default router;