import { Router } from 'express';
import CartManager from '../data/dbManagers/cart_manager.js';
import ProductManager from '../data/dbManagers/product_manager.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const carts = await CartManager.get();
        const limit = req.query.limit ? parseInt(req.query.limit) : carts.length;
        res.send(carts.slice(0, limit));
    } catch (error) {
        console.error(error);
        res.status(500).send({ estado: 'error', error: 'Error interno del servidor' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await CartManager.getById(cartId);
        cart ? res.send({ estado: 'success', payload: cart }) : res.status(404).send({ error: 'Carrito no encontrado' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ estado: 'error', error: 'Error interno del servidor' });
    }
});

router.post('/', async (req, res) => {
    try {
        await CartManager.create();
        res.send({ estado: 'success', mensaje: 'Carrito creado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ estado: 'error', error: 'Error interno del servidor' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const product = await ProductManager.getProductById(productId);
        const cart = await CartManager.getById(cartId);
        await CartManager.addToCart(cart._id, product._id);
        res.send({ estado: 'success', mensaje: 'Producto agregado al carrito' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ estado: 'error', error: 'Error interno del servidor' });
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const product = await ProductManager.getProductById(productId);
        const cart = await CartManager.getById(cartId);
        if (!product || !cart || !quantity) {
            res.status(400).send({ estado: 'error', mensaje: 'Solicitud incorrecta o entrada no válida' });
            return;
        }
        await CartManager.updateProductQuantity(cartId, productId, quantity);
        res.send({ estado: 'success', mensaje: 'Cantidad actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ estado: 'error', error: 'Error interno del servidor' });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { products } = req.body;
        const cartId = req.params.cid;
        const cart = await CartManager.getById(cartId);
        if (!cart || !products) {
            res.status(400).send({ estado: 'error', mensaje: 'Solicitud incorrecta o entrada no válida' });
            return;
        }
        await CartManager.updateCartProducts(cartId, products);
        res.send({ estado: 'success', mensaje: 'Carrito actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ estado: 'error', error: 'Error interno del servidor' });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        await CartManager.deleteProduct(cartId, productId);
        res.send({ estado: 'success', mensaje: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ estado: 'error', error: 'Error interno del servidor' });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        await CartManager.deleteAllProducts(cartId);
        res.send({ estado: 'success', mensaje: 'Todos los productos eliminados exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ estado: 'error', error: 'Error interno del servidor' });
    }
});

export default router;