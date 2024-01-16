import { Router } from "express";
import CartManager from "../../dao/cart_manager.js";
import { authenticationMiddleware, authorizationMiddleware } from "../../utils.js";
import CartModel from "../../models/cart_model.js";

const router = Router()

router.get('/carts', authenticationMiddleware('jwt'), authorizationMiddleware('user'), async (req, res) => {
    const carts = await CartModel.find({}).populate('user').populate('products.product');
    res.status(200).json(carts)
})

router.get('/carts/:cid', async (req, res) => {
    const { params: { cid } } = req;
    try {
        const result = await CartManager.getById(cid)
        console.log('result', result);
        res.render('cart', buildResponse(cid, result))
    } catch (error) {
        console.log('Error', error.message);
    }
})
const buildResponse = (cid, data) => {
    const payload = data.products.map(product => product.toJSON())
    console.log('payload', payload)
    return {
        cartId: cid,
        payload
    }
};

router.post('/carts', async (req, res) => {
    const { body } = req
    const cart = await CartManager.create(body)
    res.status(201).send('carrito agregado correctamente')
})
router.post('/carts/:cid/product/:pid', async (req, res) => {
    const { params: { pid, cid } } = req

    const cart = await CartManager.addProductToCart(cid, pid)
    res.status(201).send('producto agregado correctamente')
})
router.delete('/carts/:cid/product/:pid', async (req, res) => {
    try {
        const { params: { pid, cid } } = req
        const cart = await CartManager.deleteProductFromCart(cid, pid)
        res.status(201).send('producto eliminado correctamente')
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.put('/carts/:cid', async (req, res) => {
    try {
        const { params: { cid }, body } = req;
        await CartManager.updateById(cid, body);
        res.status(204).end();
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.put('/carts/:cid/product/:pid', async (req, res) => {
    try {
        const { params: { pid, cid }, body } = req
        const cart = await CartManager.updateProductById(cid, pid, body)
        res.status(201).send('producto actualizado correctamente')
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.delete('/carts/:cid', async (req, res) => {
    try {
        const { params: { cid } } = req
        const cart = await CartManager.deleteById(cid)
        res.status(201).send('carrito eliminado correctamente')
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

export default router