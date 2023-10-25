import express from 'express';
import fs from 'fs';

const router = express.Router();

// Especifico la ubicacion del archivo de carritos.
const carritosFilePath = 'carrito.json';

// Middleware para cargar los carritos desde el archivo antes de procesar las peticiones.
router.use(async (req, res, next) => {
    try {
        // Leo el contenido del archivo de carritos de forma asincrona.
        const carritos = await fs.readFile(carritosFilePath, 'utf-8');

        // Convierto el contenido del archivo (JSON) a un objeto JavaScript y lo adjunto al objeto de la peticion.
        req.carritos = JSON.parse(carritos);

        // Contino con la siguiente funcion en la cadena de middleware.
        next();
    } catch (error) {
        console.error('Error al cargar carritos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Manejo peticiones POST a la ruta '/'.
router.post('/', async (req, res) => {
    try {
        // Creo un nuevo carrito con un ID generado y una lista de productos vacia.
        const nuevoCarrito = {
            id: generarNuevoId(),
            products: [],
        };

        // Agregao el nuevo carrito a la lista de carritos.
        req.carritos.push(nuevoCarrito);

        // Escribo la lista actualizada de carritos de regreso al archivo.
        await fs.writeFile(carritosFilePath, JSON.stringify(req.carritos, null, 2));

        // Respondo con el nuevo carrito en formato JSON.
        res.json(nuevoCarrito);
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;