import fs from 'fs/promises';

export default class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data) || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async createCart(products = []) {
        try {
            const carts = await this.getCarts();
            const newCart = {
                id: carts.length === 0 ? 1 : carts[carts.length - 1].id + 1,
                products: products
            };
            carts.push(newCart);
            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        } catch (error) {
            console.log(error);
        }
    }

    async getCartByID(id) {
        try {
            const carts = await this.getCarts();
            return carts.find(cart => cart.id === id) || null;
        } catch (error) {
            console.log(error);
        }
    }

    async addProductToCart(cart, product) {
        try {
            const carts = await this.getCarts();
            const cartIndex = !cart ? -1 : carts.findIndex((c) => c.id === cart.id);
            if (cartIndex === -1) {
                const productToAdd = [{ id: product.id, quantity: 1 }];
                await this.createCart(productToAdd);
                return true;
            }
            const cartToUpdate = carts[cartIndex];
            const productIndex = cartToUpdate.products.findIndex((prod) => prod.id === product.id);
            if (productIndex === -1) {
                const productToAdd = { id: product.id, quantity: 1 };
                cartToUpdate.products.push(productToAdd);
            } else {
                const productToUpdate = cartToUpdate.products[productIndex];
                const updatedProduct = { ...productToUpdate, quantity: productToUpdate.quantity + 1 };
                cartToUpdate.products.splice(productIndex, 1, updatedProduct);
            }
            carts.splice(cartIndex, 1, cartToUpdate);
            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
            console.log(`Se agregó el producto ${product.title} correctamente al carrito.`);
            return true;
        } catch (error) {
            console.log(error);
        }
    }
}