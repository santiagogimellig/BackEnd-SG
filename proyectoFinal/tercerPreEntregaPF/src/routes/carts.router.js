import { Router } from "express"
import CartManager from "../classes/cartManager.js";
import ProductManager from "../classes/productManager.js";

const cartManager = new CartManager('src/cart.json');
const productManager = new ProductManager('src/products.json');
let products = await productManager.getProducts();
const CartRouter = Router()

CartRouter.post('/cart', async (req, res) => {
    const newCart = await cartManager.addCart();
    try {
        return res.status(201).json({ data: newCart, message: `Nuevo carrito con ID ${newCart.id} agregado a la base de datos.` })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

CartRouter.get('/cart/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;
        const cartFound = await cartManager.getCartByID(cartId);
        if (cartFound) {
            res.status(201).send(cartFound)
        } else {
            throw new Error('No existe un carrito con el id');
        }
    } catch (error) {
        res.status(400).json({ error: 'No existe un producto con ese id' })
    }
})
CartRouter.post('/cart/:cartId/product/:productId', async (req, res) => {
    try {
        const { cartId } = req.params
        const { productId } = req.params;

        console.log('products', products);
        const productFound = await products.find(p => productId === p.id)
        console.log('product found', productFound);
        if (productFound) {
            await cartManager.addProductToCart(cartId, productFound)
            res.status(201).send(productFound)
        } else {
            throw new Error('No existe un producto con ese id')
        }

    }
    catch (error) {
        return res.status(400).send({ error: error.message })
    }
})
export default CartRouter