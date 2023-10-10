import express from 'express';
import fs from 'fs';

const router = express.Router();
const carritosFilePath = 'carrito.json';

// Middleware para cargar los carritos desde el archivo JSON
router.use((req, res, next) => {
    const carritos = JSON.parse(fs.readFileSync(carritosFilePath, 'utf-8'));
    req.carritos = carritos;
    next();
});

// Crear un nuevo carrito
router.post('/', (req, res) => {
    const nuevoCarrito = {
        id: generarNuevoId(),
        products: [],
    };

    req.carritos.push(nuevoCarrito);
    fs.writeFileSync(carritosFilePath, JSON.stringify(req.carritos, null, 2));
    res.json(nuevoCarrito);
});

// Listar los productos de un carrito por id
router.get('/:cid', (req, res) => {
    const carrito = req.carritos.find(c => c.id === req.params.cid);
    if (carrito) {
        res.json(carrito.products);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
    const carrito = req.carritos.find(c => c.id === req.params.cid);
    const productoId = req.params.pid;

    if (carrito) {
        const productoExistente = carrito.products.find(p => p.product === productoId);

        if (productoExistente) {
        productoExistente.quantity++;
        } else {
        carrito.products.push({ product: productoId, quantity: 1 });
        }

        fs.writeFileSync(carritosFilePath, JSON.stringify(req.carritos, null, 2));
        res.json(carrito);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

export default router;