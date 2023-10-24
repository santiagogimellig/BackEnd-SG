import express from 'express';
import fs from 'fs';

const router = express.Router();
const carritosFilePath = 'carrito.json';

router.use(async (req, res, next) => {
    try {
        const carritos = await fs.readFile(carritosFilePath, 'utf-8');
        req.carritos = JSON.parse(carritos);
        next();
    } catch (error) {
        console.error('Error al cargar carritos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoCarrito = {
            id: generarNuevoId(),
            products: [],
        };

        req.carritos.push(nuevoCarrito);
        await fs.writeFile(carritosFilePath, JSON.stringify(req.carritos, null, 2));
        res.json(nuevoCarrito);
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;