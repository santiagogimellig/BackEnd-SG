import CartModel from '../models/cart_model.js';
import ProductModel from '../models/product_model.js'
import { Exception } from '../../utils.js';

export default class CartManager {
    static async get(query = {}, options) {
        const carts = await CartModel.find().lean();
        return carts;
    }

    static async getById(cid) {
        const cart = await CartModel.findById(cid).lean();
        return cart;
    }

    static async create(data) {
        const cart = await CartModel.create(data);
        console.log('Carrito creado correctamente');
        return cart;
    }

    static async updateById(sid, data) {
        const cart = await CartModel.findById(sid);
        if (!cart) {
            throw new Exception('No existe el carrito de compras', 404);
        }
        const criteria = { _id: sid };
        const operation = { $set: data };
        await ProductModel.updateOne(criteria, operation);
        console.log('Carro de compras actualizado correctamente');
    }

    static async deleteById(sid) {
        const cart = await CartModel.findById(sid);
        if (!cart) {
            throw new Exception('No existe el carrito de compras', 404);
        }
        const criteria = { _id: sid };
        await ProductModel.deleteOne(criteria);
        console.log('Carrito eliminado correctamente');
    }

    static async addToCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('El carrito no existe');
            }
            const existingProduct = cart.products.find(
                (product) => product.product._id.toString() === productId.toString()
            );
            if (existingProduct) {
                console.log("entro a la validación, el producto existe")
                existingProduct.quantity += 1;
            } else {
                const product = await ProductModel.findById(productId);
                if (!product) {
                    throw new Error('El producto no existe');
                }
                cart.products.push({
                    product: productId,
                    quantity: 1,
                });
            }
            await cart.save();
            console.log('El carrito ha sido actualizado correctamente');
            return cart;
        } catch (error) {
            console.error('Error al actualizar el carrito:', error.message);
        }
    }

    static async deleteProduct(cartId, productId) {
        const result = await CartModel.updateOne(
            { _id: cartId },
            { $pull: { products: { product: productId } } }
        );
        if (result.nModified === 0) {
            return { status: 'error', message: 'Producto no encontrado en el carrito' };
        }
        return { status: 'success', message: 'Producto eliminado del carrito' };
    };

    static async deleteAllProducts(cartId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            return { status: 'error', message: 'Carrito no encontrado' };
        }
        cart.products = [];
        await cart.save();
        return { status: 'success', message: 'Se eliminaron todos los productos del carrito' };
    }

    static async updateProductQuantity(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        console.log(cart);
        console.log(cartId)
        console.log(productId)
        console.log(quantity)
        if (!cart) {
            throw new Error('El carrito no existe');
        }
        const product = cart.products.find(
            product => product.product._id.toString() === productId.toString()
        );
        if (!product) {
            throw new Error('El producto no existe en el carrito');
        }
        product.quantity = quantity;
        await cart.save();
        console.log('La cantidad del producto ha sido actualizada exitosamente');
        return cart;
    }

    static async updateCartProducts(cartId, newProducts) {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            throw new Error('El carrito no existe');
        }
        console.log(cart.products)
        cart.products = newProducts;
        await cart.save();
        console.log('El carrito ha sido actualizado exitosamente');
        return cart;
    }
}