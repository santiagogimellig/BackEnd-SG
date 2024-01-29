// Importo las funcionalidades necesarias de Express y los modelos de datos
import { Router } from "express";
import productModel from "../dao/models/products.model.js";
import cartModel from "../dao/models/carts.model.js";
import userModel from '../dao/models/User.model.js';

// Creo una instancia del enrutador de Express
const router = Router();

// Middleware para restringir el acceso a rutas administrativas
const adminAcces = (req, res, next) => {
    console.log(req.session.user.rol);
    if (req.session.user.rol !== 'admin') {
        console.log('Solo se admite rol Admin');
        return res.redirect('/');
    }
    next();
}

// Middleware para restringir el acceso a rutas públicas
const publicAcces = (req, res, next) => {
    if (req.session.user) return res.redirect('/profile');
    next();
}

// Middleware para restringir el acceso a rutas privadas
const privateAcces = (req, res, next) => {
    if (!req.session.user) return res.redirect('/');
    next();
}

// Ruta para visualizar la lista de usuarios (requiere autenticación y rol de administrador)
router.get('/users', privateAcces, adminAcces, async (req, res) => {
    const users = await userModel.find().lean();
    const user = req.session.user;
    res.render('users', {
        users, user
    });
});

// Ruta para el formulario de registro (requiere acceso público)
router.get('/register', publicAcces, (req, res) => {
    res.render('register');
});

// Ruta para el formulario de inicio de sesión (requiere acceso público)
router.get('/', publicAcces, (req, res) => {
    res.render('login');
});

// Ruta para ver el perfil del usuario autenticado (requiere autenticación)
router.get('/profile', privateAcces, (req, res) => {
    res.render('profile', {
        user: req.session.user
    });
});

// Ruta para visualizar la lista de productos paginada
router.get("/products", async (req, res) => {
    const { page = 1 } = req.query;
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } = await productModel.paginate({}, { limit: 4, page, lean: true });
    const products = docs;
    if (page <= totalPages && page > 0 && docs.length > 0) {
        res.render('products', {
            products,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            user: req.session.user
        });
    } else {
        res.status(400).send({ error: 'Page not exists' });
    }
});

// Ruta para visualizar los detalles de un producto específico
router.get("/products/:idproduct", async (req, res) => {
    const idProduct = req.params.idproduct;
    const product = await productModel.find({ "_id": idProduct });
    const carts = await cartModel.find();
    res.render('product_detail', {
        product: product[0].toJSON(),
        carts: carts.map(cart => cart.toJSON())
    });
});

// Ruta para visualizar los productos de un carrito específico
router.get("/carts/:idcart", async (req, res) => {
    const idCart = req.params.idcart;
    const carts = await cartModel.find({ "_id": idCart }).populate('products.product');
    const products = carts[0].products;
    res.render('carts', {
        idCart,
        products: products.map(product => product.toJSON())
    });
});

// Ruta para acceder a la funcionalidad de chat
router.get("/chat", (req, res) => {
    res.render("chat");
});

// Exporto el enrutador configurado con las rutas definidas
export default router;