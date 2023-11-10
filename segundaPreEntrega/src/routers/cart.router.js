import { Router } from 'express';
import CartManager from '../dao/CartManager.js';
import productsManager from '../dao/ProductsManager.js'
import cartsModel from '../dao/models/carts.model.js';

const router = Router();

router.post("/carts", async (req, res) => {
    try {
        let { body: data } = req;
        const cart = await CartManager.addCart(data);

        if (cart) {
            res.status(201).send({
                message: "Cart created successfully",
                cart: cart
            });
        } else {
            res.status(404).send("Cart not created.");
        }
    } catch (error) {
        console.error("Error adding cart:", error);
        res.status(500).send("Error adding cart.");
    }
});

router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await CartManager.getCartById(req.params.cid);

        if (cart) {
            res.status(200).send(cart);
        } else {
            res.status(404).send("Cart not found.");
        }
    } catch (error) {
        console.error("Error getting cart:", error);
        res.status(500).send("Error getting cart.");
    }
});

router.delete("/carts/:cid", async (req, res) => {
    try {
        const deletedCart = await CartManager.deleteCart(req.params.cid);

        if (deletedCart) {
            res.status(200).send("Cart deleted successfully");
        } else {
            res.status(404).send("Cart not found.");
        }
    } catch (error) {
        console.error("Error deleting cart:", error);
        res.status(500).send("Error deleting cart.");
    }
});

router.delete("/carts/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await CartManager.removeProductFromCart(cartId, productId);

        if (updatedCart) {
            res.status(200).send("Product removed from cart successfully");
        } else {
            res.status(404).send("Product or cart not found.");
        }
    } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).send("Error removing product from cart.");
    }
});

router.put("/carts/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const updatedProducts = req.body.products;

        const updatedCart = await CartManager.updateCart(cartId, updatedProducts);

        if (updatedCart) {
            res.status(200).send(updatedCart);
        } else {
            res.status(404).send("Cart not found.");
        }
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).send("Error updating cart.");
    }
});

router.put("/carts/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await CartManager.updateProductQuantity(cartId, productId, newQuantity);

        if (updatedCart) {
            res.status(200).send("Product quantity updated successfully");
        } else {
            res.status(404).send("Product or cart not found.");
        }
    } catch (error) {
        console.error("Error updating product quantity in cart:", error);
        res.status(500).send("Error updating product quantity in cart.");
    }
});

export default router;
