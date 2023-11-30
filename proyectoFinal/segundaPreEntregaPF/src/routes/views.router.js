import { Router } from "express";
import ProductManager from "../data/dbManagers/product_manager.js";
import CartManager from "../data/dbManagers/cart_manager.js";

const router = Router();

const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/home');
    next();
}

const privateAccess = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
}

router.get('/home', privateAccess, async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = null, category = null } = req.query;
        const query = {}
        const options = {
            page: page,
            limit: limit
        }
        if (sort) {
            options.sort = { price: sort }
        }
        if (category) {
            query.category = category
        }
        const prods = await ProductManager.get(query, options);
        const user = req.session.user
        res.render('home', { prods, user, title: 'Inicio' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
    }
})

router.get('/realtimeproducts', async (req, res) => {
    try {
        const prods = await ProductManager.get();
        res.render('realTimeProducts', { prods });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
    }
})

router.get('/addproduct', (req, res) => {
    try {
        res.render('addproduct');
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
    }
})

router.get('/chat', (req, res) => {
    try {
        res.render('chat')
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
    }
})

router.get('/cart/:cid', async (req, res) => {
    try {
        const idCart = req.params.cid;
        const cart = await CartManager.getById(idCart);
        res.render('cart', { cart, title: 'Carrito de compras' })
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
    }
})

router.get('/home/:cid/product/:pid', async (req, res) => {
    try {
        const refererUrl = req.headers.referer;
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const product = await ProductManager.getById(productId);
        const cart = await CartManager.getById(cartId);
        CartManager.addToCart(cart._id, product._id);
        res.redirect(refererUrl)
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
    }
})

router.get('/register', publicAccess, async (req, res) => {
    res.render('register', { title: 'Registro' });
})

router.get('/login', publicAccess, async (req, res) => {
    res.render('login', { title: 'Iniciar sesión' });
})

router.get('/recovery-password', publicAccess, async (req, res) => {
    res.render('recoveryPassword', { title: 'Recuperación de contraseña' });
})

export default router;