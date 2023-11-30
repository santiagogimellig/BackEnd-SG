import { Router } from "express";
import ProductManager from "../data/dbManagers/product_manager.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = null, category = null } = req.query;
        const query = {}
        const options = {
            page: page,
            limit: limit
        }
        const products = await ProductManager.get(query, options);
        res.send({ status: 'success', products });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', error });
    }
})

router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const product = await ProductManager.getById(productId);
    product ? res.send({ status: 'success', payload: product }) : res.send({ error: 'Producto no encontrado' });
})

router.post('/', async (req, res) => {
    try {
        const product = req.body;
        if (
            !product.title ||
            !product.description ||
            !product.price ||
            !product.code ||
            !product.stock ||
            !product.category
        ) {
            return res.status(400).send({ status: 'error', error: 'Valores incompletos o incorrectos' })
        }
        const result = await ProductManager.add(product);
        const io = req.app.get('socketio');
        io.emit('actualizarProductos', await ProductManager.getAll());
        res.send({ status: 'success', payload: result })
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', error });
    }
})

router.put('/:pid', async (req, res) => {
    const product = req.body;
    const productId = req.params.pid;
    const result = await ProductManager.update(productId, product)
    result ? res.send({ status: 'success', payload: result }) : res.status(400).send({ status: 'error', error: 'No se puede actualizar' });
})

router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const result = await ProductManager.delete(productId)
    if (result != null) {
        const io = req.app.get('socketio');
        res.send({ status: 'Success', message: 'Eliminado exitosamente' })
    } else {
        res.status(400).send({ status: 'error', error: 'Elemento para eliminar no encontrado' });
    }
})

export default router;