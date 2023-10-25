import express from 'express';
import fs from 'fs';

// Creo un enrutador utilizando Express.
const router = express.Router();

// Especifico la ubicacion del archivo de productos.
const productosFilePath = 'productos.json';

// Funcion para generar un nuevo ID unico para un producto.
function generarNuevoId(productos) {
    let id;
    do {
        id = Math.floor(Math.random() * 1000).toString();
    } while (productos.some(p => p.id === id));
    return id;
}

// Middleware para cargar los productos desde el archivo antes de procesar las peticiones.
router.use((req, res, next) => {
    const productos = JSON.parse(fs.readFileSync(productosFilePath, { encoding: 'utf-8' }));
    console.log('Productos cargados:', productos);
    req.productos = productos;
    next();
});

// Ruta para obtener todos los productos.
router.get('/', (req, res) => {
    res.json(req.productos);
});

// Ruta para obtener un producto por su ID.
router.get('/:pid', (req, res) => {
    const producto = req.productos.find(p => p.id === req.params.pid);
    if (producto) {
        res.json(producto);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

// Ruta para agregar un nuevo producto.
router.post('/', (req, res) => {
    const nuevoProducto = {
        id: generarNuevoId(req.productos),
        ...req.body,
        status: true,
    };

    req.productos.push(nuevoProducto);
    fs.writeFileSync(productosFilePath, JSON.stringify(req.productos, null, 2));
    res.json(nuevoProducto);
});

// Ruta para actualizar un producto por su ID.
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

// Ruta para eliminar un producto por su ID.
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