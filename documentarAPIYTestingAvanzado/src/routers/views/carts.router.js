import { Router } from "express"; // Importar el enrutador de Express
import CartController from "../../controllers/cart.controller.js"; // Importar el controlador de carrito

const router = Router(); // Crear un nuevo enrutador

// Función para construir la respuesta con los detalles del carrito
const buildResponse = (cid, data) => {
    const payload = data.products.map(product => product.toJSON()); // Mapear los productos del carrito a formato JSON
    return {
        cartId: cid, // ID del carrito
        payload // Productos del carrito
    };
};

// Ruta para obtener los detalles de un carrito por su ID
router.get('/:cid', async (req, res) => {
    const { cid } = req.params; // Obtener el ID del carrito de los parámetros de la URL
    try {
        const result = await CartController.getById(cid); // Obtener los detalles del carrito por su ID
        res.render('cart', buildResponse(cid, result)); // Renderizar la vista de carrito con los detalles obtenidos
    } catch (error) {
        console.log('Error', error.message); // Manejar error
    }
});

export default router; // Exportar el enrutador