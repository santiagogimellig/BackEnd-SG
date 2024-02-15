import { Router } from "express";
import productModel from "../../models/product.model.js"; // Se importa el modelo de producto
import ProductController from '../../controllers/products.controller.js'; // Se importa el controlador de productos
import config from "../../config.js"; // Se importa la configuración de la aplicación
import passport from "passport"; // Se importa Passport para la autenticación

const router = Router(); // Se crea un enrutador para manejar las rutas relacionadas con los productos

// Middleware para redirigir al usuario a la página de inicio de sesión si no está autenticado
const privateRouter = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// Función para construir la respuesta para renderizar la vista de productos
const buildResponse = (data, req) => {
    const { category } = req.query; // Se obtiene la categoría de la consulta
    const baseUrl = `http://localhost:${config.port}/products`; // URL base para los enlaces de paginación
    const categoryParam = category ? `?category=${category}` : ''; // Parámetro de categoría si está presente
    // Construcción de los enlaces previo y siguiente para la paginación
    const prevLink = data.hasPrevPage ? `${baseUrl}${categoryParam}&limit=${data.limit}&page=${data.prevPage}` : '';
    const nextLink = data.hasNextPage ? `${baseUrl}${categoryParam}&limit=${data.limit}&page=${data.nextPage}` : '';
    // Construcción de la respuesta
    return {
        title: "Products",
        status: "success",
        user: req.user, // Se incluye el usuario autenticado en la respuesta
        payload: data.docs.map(product => product.toJSON()), // Se convierten los productos a formato JSON
        totalPages: data.totalPages, // Número total de páginas de productos
        prevPage: data.prevPage, // Página anterior
        nextPage: data.nextPage, // Página siguiente
        page: data.page, // Página actual
        hasPrevPage: data.hasPrevPage, // Indica si hay una página anterior
        hasNextPage: data.hasNextPage, // Indica si hay una página siguiente
        prevLink, // Enlace a la página anterior
        nextLink, // Enlace a la página siguiente
    };
};

// Ruta GET /products para mostrar la lista de productos
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { page = 1, limit = 10, category, code, price, title, sort, stock } = req.query; // Se obtienen los parámetros de la consulta
        const options = { page, limit }; // Opciones de paginación
        const criteria = {}; // Criterios de búsqueda de productos
        if (sort) options.sort = { price: sort }; // Se aplica el orden si está presente
        if (category) criteria.category = category; // Se filtra por categoría si está presente
        if (code) criteria.code = code; // Se filtra por código si está presente
        if (price) criteria.price = price; // Se filtra por precio si está presente
        if (title) criteria.title = title; // Se filtra por título si está presente
        if (stock) console.log("stock", stock); // Se realiza alguna acción relacionada con el stock
        const result = await ProductController.get(criteria, options); // Se obtienen los productos según los criterios y opciones
        const response = buildResponse(result, req); // Se construye la respuesta
        response.user = req.user; // Se agrega el usuario autenticado a la respuesta
        response.user.first_name = req.user.firstName; // Se agrega el nombre del usuario autenticado
        response.user.last_name = req.user.lastName; // Se agrega el apellido del usuario autenticado
        res.render('products', response); // Se renderiza la vista de productos con la respuesta construida
    } catch (error) {
        res.status(500).json({ error: error.message }); // Se maneja el error si ocurre
    }
});

export default router; // Se exporta el enrutador de productos
