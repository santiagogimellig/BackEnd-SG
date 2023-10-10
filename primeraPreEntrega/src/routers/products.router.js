import express from 'express';
import fs from 'fs';

const router = express.Router();
const productosFilePath = 'productos.json';

function generarNuevoId() {
    return Math.floor(Math.random() * 1000); // Ejemplo de generación aleatoria
}

// Middleware para cargar los productos desde el archivo JSON
router.use((req, res, next) => {
    const productos = JSON.parse(fs.readFileSync(productosFilePath, 'utf-8'));
    console.log('Productos cargados:', productos);
    req.productos = productos;
    next();
});

// Listar todos los productos
router.get('/', (req, res) => {
    res.json(req.productos);
});

// Obtener un producto por id
router.get('/:pid', (req, res) => {
    const producto = req.productos.find(p => p.id === req.params.pid);
    if (producto) {
        res.json(producto);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

// Agregar un nuevo producto
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

// Actualizar un producto por id
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

// Eliminar un producto por id
router.delete('/:pid', (req, res) => {
    console.log('ID del producto a eliminar:', req.params.pid);
    req.productos = req.productos.filter(p => p.id !== req.params.pid);
    fs.writeFileSync(productosFilePath, JSON.stringify(req.productos, null, 2));
    res.send('Producto eliminado');
});

export default router;
