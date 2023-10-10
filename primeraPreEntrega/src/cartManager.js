import { promises as fs } from 'fs';

class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.nextId = 1;
        this.carts = [];
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.carts = JSON.parse(data);
            this.nextId = this.getNextId();
        } catch (error) {
            console.error('Error al cargar carritos:', error);
        }
    }

    getNextId() {
        return this.carts.length > 0 ? Math.max(...this.carts.map(c => c.id)) + 1 : 1;
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf8');
        } catch (error) {
            console.error('Error al guardar carritos:', error);
        }
    }

    async createCart() {
        const newCart = {
            id: this.nextId++,
            products: [],
        };
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCartById(id) {
        const cart = this.carts.find(c => c.id === id);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        return cart;
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await this.getCartById(cartId);
        const existingProduct = cart.products.find(p => p.product === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        await this.saveCarts();
    }
}

const cartManager = new CartManager('carrito.json'); // Asegúrate de que el nombre sea correcto
cartManager.loadCarts();

export default cartManager;