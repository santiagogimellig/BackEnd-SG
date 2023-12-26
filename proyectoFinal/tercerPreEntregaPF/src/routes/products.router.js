import { Router } from "express"
import ProductManager from '../classes/productManager.js'
import { getNewId } from "../utils.js";

const productManager = new ProductManager('src/products.json');
let products = await productManager.getProducts();
const ProductRouter = Router()
ProductRouter.get('/products', async (req, res) => {
    const { limit } = req.query;
    if (!limit) {
        return res.status(201).send(products)
    } else {
        const numberLimit = parseInt(limit);

        if (isNaN(numberLimit) || numberLimit <= 0) {
            return res.status(400).json({ error: 'Limite invalido' });
        } else {
            const limitedProducts = products.slice(0, numberLimit);
            return res.json(limitedProducts);
        }

    }
});
ProductRouter.get('/products/:productId', async (req, res) => {
    const { productId } = req.params;
    const prod = products.find((product) => product.id === productId)
    if (!prod) {
        return res.status(400).json({ error: 'No existe un producto con ese id' });
    } else {
        const product = products.find((user) => user.id === productId);
        res.json(product);
    }
});

ProductRouter.post('/products', async (req, res) => {
    const body = req.body;
    const { title, description, code, price, status, category, thumbnails } = body
    try {
        if (!(title && description && code && price
            && status && category)) {
            return res.status(400).json({ error: `todos los campos son requeridos` })
        }
        if (!(typeof title === 'string' && typeof description === 'string'
            && typeof code === 'string' && typeof price === 'number'
            && typeof category === 'string')) {
            return res.status(400).json({ message: 'Error en el tipo de dato ingresado' })
        }
        const newProduct = {
            id: getNewId(),
            title,
            description,
            code,
            price,
            status,
            category,
            thumbnails
        }
        let added = await productManager.addProduct(newProduct)
        console.log(added);
        if (!added) {
            throw new Error(`El producto no se pudo agregar`)
        }
        else {
            socketServer.emit('messages', await productManager.getProduct())
            return res.status(201).send('producto agregado', newProduct)
        }
    }
    catch (error) {
        // console.log(error.message)
        console.log("error", error)
        return res.status(500).send(error)
    }
})
ProductRouter.put('/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params
        const update = req.body
        const productToUpdate = products.find(p => (productId === p.id))
        if (productToUpdate) {
            await productManager.updateProduct(productId, update)
            socketServer.emit('messages', await productManager.getProduct())
            res.status(201).send({ message: `acutalizacion del producto de id ${productId}` })
        } else {
            res.status(400).send({ message: 'no se puedo actualizar el producto' })
        }
    }
    catch (error) {
        return res.status(400).send({ error: err.message })
    }
})
ProductRouter.delete('/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params
        const productToEliminate = products.find(p => (productId === p.id))
        if (productToEliminate) {
            await productManager.deleteProduct(productId)
            socketServer.emit('messages', await productManager.getProduct())
            res.status(201).send({ message: `Se elimino el producto de id ${productId}` })
        } else {
            res.status(400).send({ message: 'no se puedo eliminar el producto' })
        }

    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
})

export { ProductRouter, products };