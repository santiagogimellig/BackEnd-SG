import { Router } from "express"; // Importar el enrutador de Express
import ProductManager from "../../dao/ProductManager.js"; // Importar el gestor de productos
import { uploader } from "../../helpers/utils.js"; // Importar utilidades de carga de archivos
import passport from "passport"; // Importar Passport.js para autenticación
import config from "../../config.js"; // Importar configuración de la aplicación
import ProductsController from "../../controllers/products.controller.js"; // Importar controlador de productos
import { authorizationMiddleware } from "../../helpers/utils.js"; // Importar middleware de autorización
import { CustomError } from "../../helpers/CustomError.js"; // Importar clase de error personalizado
import EnumsError from "../../helpers/EnumsError.js"; // Importar enumeraciones de errores
import { generatorProductError } from "../../helpers/CauseMessageError.js"; // Importar generador de mensajes de error de producto
import mongoose from "mongoose"; // Importar Mongoose para trabajar con MongoDB

const router = Router(); // Crear un nuevo enrutador

// Función para construir la respuesta paginada
const buildResponse = (data) => {
    return {
        status: "success",
        payload: data.docs.map(product => product.toJSON()),
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevLink: data.hasPrevPage ? `http://localhost:${config.port}/products?limit=${data.limit}&page=${data.prevPage}` : '',
        nextLink: data.hasNextPage ? `http://localhost:${config.port}/products?limit=${data.limit}&page=${data.nextPage}` : '',
    }
}

// Obtener todos los productos paginados
router.get('/', passport.authenticate('jwt', { session: false }), authorizationMiddleware(['user', 'admin', 'premium']), async (req, res, next) => {
    try {
        const { page = 1, limit = 10, category, sort } = req.query; // Obtener parámetros de consulta
        const options = {
            page,
            limit,
            sort: { price: sort || 'asc' } // Ordenar por precio ascendente por defecto
        }
        const criteria = {};
        if (category) {
            criteria.category = category; // Agregar criterio de búsqueda por categoría
        }
        const result = await ProductsController.get(criteria, options); // Obtener productos según los criterios y opciones de paginación
        res.status(200).json(result); // Devolver resultado
    } catch (error) {
        console.error(error.message); // Manejar error
        next(error);
    }
});

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params; // Obtener ID del producto de la URL
        const product = await ProductsController.getById(pid); // Obtener producto por ID
        res.status(200).json(product); // Devolver producto
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message }) // Manejar error
    }
});

// Crear productos de prueba (solo para administradores)
router.post('/mockingproducts', passport.authenticate('jwt', { session: false }), authorizationMiddleware('admin'), async (req, res, next) => {
    const PRODUCTS_QUANTITY = 5; // Cantidad de productos a crear
    try {
        await ProductsController.createFakeProduct(PRODUCTS_QUANTITY); // Crear productos falsos
        return res.status(200).json({ message: "Productos creados" }); // Devolver mensaje de éxito
    } catch (error) {
        console.error("Error: ", error.message); // Manejar error
        next(error);
    }
});

// Crear un nuevo producto
router.post('/', passport.authenticate('jwt', { session: false }), authorizationMiddleware(['admin', 'premium']), uploader.array('thumbnails', 4), async (req, res, next) => {
    let { body } = req; // Obtener cuerpo de la solicitud
    const { files } = req; // Obtener archivos cargados
    const { title, description, code, price, stock, category } = req.body; // Obtener datos del producto
    try {
        // Verificar que se proporcionen todos los datos necesarios para crear un producto
        if (!title || !description || !code || !price || !stock || !category) {
            CustomError.createError({
                name: 'Error creando el producto',
                cause: generatorProductError({
                    title, description, code, price, stock, category
                }),
                message: 'Ocurrió un error mientras intentábamos crear un producto.',
                code: EnumsError.BAD_REQUEST_ERROR,
            });
        }
        const product = await ProductsController.create(body, files); // Crear producto
        res.status(201).json(product); // Devolver producto creado
    } catch (error) {
        next(error); // Manejar error
    }
});

// Actualizar un producto existente
router.put('/:pid', passport.authenticate('jwt', { session: false }), authorizationMiddleware(['admin', 'premium']), async (req, res) => {
    const { pid } = req.params; // Obtener ID del producto de la URL
    const { body } = req; // Obtener datos actualizados del producto
    try {
        const uid = new mongoose.Types.ObjectId(req.user.id); // Obtener ID de usuario autenticado
        if (req.user.rol === 'premium') { // Si el usuario es premium
            const product = await ProductManager.getById(pid); // Obtener producto por ID
            if (!product.owner.equals(uid)) { // Verificar si el usuario es propietario del producto
                return res.status(400).json({ error: `No se puede modificar un producto del cual no se es propietario.` }) // Devolver error si el usuario no es propietario
            }
        }
        await ProductManager.updateById(pid, body); // Actualizar producto
        res.status(204).end(); // Devolver respuesta exitosa sin contenido
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message }); // Manejar error
    }
});

// Eliminar un producto
router.delete('/:pid', passport.authenticate('jwt', { session: false }), authorizationMiddleware(['admin', 'premium']), async (req, res, next) => {
    try {
        const { pid } = req.params; // Obtener ID del producto de la URL
        const uid = new mongoose.Types.ObjectId(req.user.id); // Obtener ID de usuario autenticado
        if (req.user.rol === 'premium') { // Si el usuario es premium
            const product = await ProductManager.getById(pid); // Obtener producto por ID
            if (!product.owner.equals(uid)) { // Verificar si el usuario es propietario del producto
                return res.status(400).json({ error: `No se puede borrar un producto del cual no se es propietario` }) // Devolver error si el usuario no es propietario
            }
        }
        await ProductManager.deleteById(pid); // Eliminar producto por ID
        res.status(204).end(); // Devolver respuesta exitosa sin contenido
    } catch (error) {
        console.log(error.message); // Manejar error
        next(error);
    }
});

export default router; // Exportar el enrutador