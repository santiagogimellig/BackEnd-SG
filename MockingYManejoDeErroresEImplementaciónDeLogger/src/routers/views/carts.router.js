import { Router } from "express";
import CartController from "../../controllers/cart.controller.js";

const router = Router();

// Función para construir la respuesta de la ruta
const buildResponse = (cid, data) => {
    // Mapeo de los productos para obtener sus datos en formato JSON
    const payload = data.products.map(product => product.toJSON())
    return {
        cartId: cid,
        payload
    }
}

// Ruta para obtener el carrito por su ID
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        // Se obtiene el carrito por su ID utilizando el controlador correspondiente
        const result = await CartController.getById(cid)
        // Se renderiza la vista 'cart' con la respuesta construida
        res.render('cart', buildResponse(cid, result))
    } catch (error) {
        console.log('Error', error.message);
    }
})

export default router;
