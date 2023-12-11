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
        const products = await ProductManager.getProducts(query, options);
        res.send({ status: 'success', products });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', error });
    }
})

router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const product = await ProductManager.getProductById(productId);
    product ? res.send({ status: 'success', payload: product }) : res.send({ error: 'Producto no encontrado' });
})


router.post("/", async (req, res) => {
    const { body } = req;
    const newProduct = await ProductManager.createProduct(body);
    res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
    const product = req.body;
    const productId = req.params.pid;
    const result = await ProductManager.updateProductById(productId, product)
    result ? res.send({ status: 'success', payload: result }) : res.status(400).send({ status: 'error', error: 'No se puede actualizar' });
})

router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const result = await ProductManager.deleteProductById(productId)
    if (result != null) {
        const io = req.app.get('socketio');
        res.send({ status: 'Success', message: 'Eliminado exitosamente' })
    } else {
        res.status(400).send({ status: 'error', error: 'Elemento para eliminar no encontrado' });
    }
})

export default router;