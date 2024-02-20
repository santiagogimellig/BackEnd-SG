import { Router } from "express"; // Importar el enrutador de Express
import productModel from "../../models/product.model.js"; // Importar el modelo de producto
import ProductController from '../../controllers/products.controller.js'; // Importar el controlador de productos
import config from "../../config.js"; // Importar la configuración de la aplicación
import passport from "passport"; // Importar Passport.js para autenticación

const router = Router(); // Crear un nuevo enrutador

// Middleware para verificar si el usuario ha iniciado sesión
const privateRouter = (req, res, next) => {
    if (!req.session.user) { // Verificar si el usuario está autenticado
        return res.redirect('/login'); // Redirigir al usuario a la página de inicio de sesión si no está autenticado
    }
    next(); // Continuar con la siguiente función middleware si el usuario está autenticado
};

// Función para construir la respuesta de la página de productos
const buildResponse = (data, req) => {
    const { category } = req.query; // Obtener la categoría de los parámetros de la solicitud
    const user = req.user; // Obtener el usuario de la solicitud
    const payload = data.docs.map(product => product.toJSON()); // Mapear los productos a formato JSON
    const totalPages = data.totalPages; // Obtener el número total de páginas
    const prevPage = data.prevPage; // Obtener el número de página anterior
    const nextPage = data.nextPage; // Obtener el número de página siguiente
    const page = data.page; // Obtener el número de página actual
    const hasPrevPage = data.hasPrevPage; // Verificar si hay una página anterior
    const hasNextPage = data.hasNextPage; // Verificar si hay una página siguiente
    const prevLink = data.hasPrevPage ? buildPageLink(req, data.prevPage, data.limit, data.sort, category) : ''; // Construir enlace a la página anterior
    const nextLink = data.hasNextPage ? buildPageLink(req, data.nextPage, data.limit, data.sort, category) : ''; // Construir enlace a la página siguiente
    
    // Construir y devolver la respuesta
    return {
        title: "Products",
        status: "success",
        user: user,
        payload: payload,
        totalPages: totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        page: page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: prevLink,
        nextLink: nextLink
    };
};

// Función para construir el enlace a una página específica de productos
const buildPageLink = (req, page, limit, sort, category) => {
    const baseUrl = `http://localhost:${config.port}/products?limit=${limit}&page=${page}`;
    const categoryParam = category ? `&category=${category}` : '';
    const sortParam = sort ? `&sort=${sort}` : '';
    return `${baseUrl}${categoryParam}${sortParam}`;
};

// Ruta para obtener la lista de productos
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { page = 1, limit = 10, category, code, price, title, sort, stock } = req.query; // Obtener parámetros de la solicitud
        const options = { page, limit }; // Opciones de paginación y límite
        const criteria = {}; // Criterios de búsqueda de productos
        
        // Agregar criterios de búsqueda según los parámetros de la solicitud
        if (sort) options.sort = { price: sort };
        if (category) criteria.category = category;
        if (code) criteria.code = code;
        if (price) criteria.price = price;
        if (title) criteria.title = title;
        if (stock) console.log("stock", stock);
        
        const result = await ProductController.get(criteria, options); // Obtener productos según los criterios y opciones
        const response = buildResponse(result, req); // Construir la respuesta de la página de productos
        response.user = req.user; // Agregar información de usuario a la respuesta
        response.user.first_name = req.user.firstName; // Agregar el nombre del usuario a la respuesta
        response.user.last_name = req.user.lastName; // Agregar el apellido del usuario a la respuesta
        res.render('products', response); // Renderizar la vista de productos con la respuesta construida
    } catch (error) {
        res.status(500).json({ error: error.message }); // Manejar errores y devolver un mensaje de error en caso de fallo
    }
});

export default router; // Exportar el enrutador