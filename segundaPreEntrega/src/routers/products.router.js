import { Router } from 'express';
import ProductManager from '../dao/ProductsManager.js';
import productsModel from '../dao/models/products.model.js';

const router = Router();

router.get("/products", async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;

    try {
        let options = {
            limit: parseInt(limit),
            page: parseInt(page),
        };

        let filter = {};

        if (query) {
            filter = { category: query };
        }

        if (sort === 'asc' || sort === 'desc') {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        const result = await productsModel.paginate(filter, options);

        if (req.accepts('html')) {
            res.render('products', {
                products: result.docs,
                totalPages: result.totalPages,
                prevLink: result.hasPrevPage ? `/api/products?page=${result.page - 1}&limit=${options.limit}` : null,
                nextLink: result.hasNextPage ? `/api/products?page=${result.page + 1}&limit=${options.limit}` : null,
            });
        } else if (req.accepts('json')) {
            const response = {
                status: "success",
                payload: result.docs,
                totalPages: result.totalPages,
                prevPages: result.page - 1,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/api/products?page=${result.page - 1}&limit=${options.limit}` : null,
                nextLink: result.hasNextPage ? `/api/products?page=${result.page + 1}&limit=${options.limit}` : null,
            };
            res.status(200).send(response);
        }
    } catch (error) {
        console.error("Error getting products:", error);
        res.status(500).send("Error getting products.");
    }
});

router.get("/products/search", async (req, res) => {
    const { category, availability, sort } = req.query;

    try {
        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (availability) {
            filter.availability = availability === 'true';
        }

        const result = await ProductManager.getProducts(filter, sort);

        res.status(200).send(result);
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).send("Error searching products.");
    }
});

router.get("/products/:id", async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await ProductManager.getProductById(productId);

        if (product) {
            res.status(200).send(product);
        } else {
            res.status(404).send("Product not found.");
        }
    } catch (error) {
        console.error("Error getting product:", error);
        res.status(500).send("Error getting product.");
    }
});

router.post("/products", async (req, res) => {
    const { name, price, category, availability } = req.body;

    try {
        const newProduct = await ProductManager.addProduct({
            name,
            price,
            category,
            availability,
        });

        res.status(201).send(newProduct);
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).send("Error adding product.");
    }
});

router.put("/products/:id", async (req, res) => {
    const productId = req.params.id;
    const { name, price, category, availability } = req.body;

    try {
        const updatedProduct = await ProductManager.updateProduct(productId, {
            name,
            price,
            category,
            availability,
        });

        if (updatedProduct) {
            res.status(200).send(updatedProduct);
        } else {
            res.status(404).send("Product not found.");
        }
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Error updating product.");
    }
});

router.delete("/products/:id", async (req, res) => {
    const productId = req.params.id;

    try {
        const deletedProduct = await ProductManager.deleteProduct(productId);

        if (deletedProduct) {
            res.status(200).send(deletedProduct);
        } else {
            res.status(404).send("Product not found.");
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("Error deleting product.");
    }
});

export default router;