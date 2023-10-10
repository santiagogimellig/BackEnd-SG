import express from 'express';
import fs from 'fs';

const router = express.Router();
const productosFilePath = 'productos.json';

function generarNuevoId() {
    return Math.floor(Math.random() * 1000);
}

router.use((req, res, next) => {
    const productos = JSON.parse(fs.readFileSync(productosFilePath, { encoding: 'utf-8' }));
    console.log('Productos cargados:', productos);
    req.productos = productos;
    next();
});

router.get('/', (req, res) => {
    res.json(req.productos);
});

router.get('/:pid', (req, res) => {
    const producto = req.productos.find(p => p.id === req.params.pid);
    if (producto) {
        res.json(producto);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

router.post('/', (req, res) => {
    const nuevoProducto = {
        id: generarNuevoId(),
        ...req.body,
        status: true,
    };

    req.productos.push(nuevoProducto);
    fs.writeFileSync(productosFilePath, JSON.stringify(req.productos, null, 2));
    res.json(nuevoProducto);
});

router.put('/:pid', (req, res) => {
    const productoIndex = req.productos.findIndex(p => p.id === req.params.pid);
    if (productoIndex !== -1) {
        req.productos[productoIndex] = { ...req.productos[productoIndex], ...req.body };
        fs.writeFileSync(productosFilePath, JSON.stringify(req.productos, null, 2));
        res.json(req.productos[productoIndex]);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

router.delete('/:pid', (req, res) => {
    try {
        console.log('ID del producto a eliminar:', req.params.pid);
        req.productos = req.productos.filter(p => p.id !== req.params.pid);
        fs.writeFileSync(productosFilePath, JSON.stringify(req.productos, null, 2));
        res.send('Producto eliminado');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).send('Error interno del servidor al eliminar el producto');
    }
});

export default router;