import { Router } from "express";
import ProductManager from "../../dao/product_manager.js";
import productModel from "../../models/product_model.js";
import userModel from "../../models/users_model.js";
import passport from 'passport';
import { authenticationMiddleware, authorizationMiddleware } from "../../utils.js";

const router = Router()

router.get('/products', authenticationMiddleware('jwt'),
    async (req, res) => {
        const { page = 1, limit = 5, group, sort } = req.query;
        const opts = { page, limit, sort: { price: sort || 'asc' } };
        const criteria = {};
        const { first_name, last_name, rol } = req.user;

        if (group) {
            criteria.category = group;
        }
        const result = await productModel.paginate(criteria, opts);
        res.render('products', buildResponse({ ...result, group, sort, first_name, last_name, rol }));
    });
const buildResponse = (data) => {
    return {
        status: 'success',
        payload: data.docs.map(product => product.toJSON()),
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        userName: data.first_name,
        userLastName: data.last_name,
        userRol: data.rol,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevLink: data.hasPrevPage ? `http://localhost:8080/products?limit=${data.limit}&page=${data.prevPage}${data.group ? `&group=${data.group}` : ''}${data.sort ? `&sort=${data.sort}` : ''}` : '',
        nextLink: data.hasNextPage ? `http://localhost:8080/products?limit=${data.limit}&page=${data.nextPage}${data.group ? `&group=${data.group}` : ''}${data.sort ? `&sort=${data.sort}` : ''}` : '',
    };
};

router.get('/products/:pid', authenticationMiddleware('jwt'), async (req, res) => {
    try {
        const { params: { pid } } = req
        const product = await ProductManager.getById(pid)
        res.status(200).json(product)
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})

router.post('/products', authorizationMiddleware('admin'), async (req, res) => {
    const { body } = req
    await ProductManager.create(body)
    res.render('realTimeProducts', { title: 'Registro de productos' })
})

router.put('/products/:pid', async (req, res) => {
    try {
        const { params: { pid }, body } = req;
        await ProductManager.updateById(pid, body);
        res.status(204).end();
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.delete('/products/:pid', authorizationMiddleware('admin'), async (req, res) => {
    try {
        const { params: { pid } } = req;
        await ProductManager.deleteById(pid);
        res.status(204).end();
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

export default router