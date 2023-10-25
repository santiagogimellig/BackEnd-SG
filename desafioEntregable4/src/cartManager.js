import { promises as fs } from 'fs';

class CartManager {
    constructor(filePath) {
        this.path = filePath; // Ruta del archivo donde se almacenaran los carritos.
        this.nextId = 1; // Identificador para el próximo carrito.
        this.carts = []; // Lista de carritos.
    }

    async loadCarts() {
        try {
            // Intento leer el archivo de carritos y parsearlos como JSON.
            const data = await fs.readFile(this.path, 'utf8');
            this.carts = JSON.parse(data);
            this.nextId = this.getNextId(); // Actualizo el siguiente ID.
        } catch (error) {
            console.error('Error al cargar carritos:', error);
        }
    }

    getNextId() {
        // Calculo el siguiente ID basado en los IDs existentes.
        return this.carts.length > 0 ? Math.max(...this.carts.map(c => c.id)) + 1 : 1;
    }

    async saveCarts() {
        try {
            // Guardo los carritos en el archivo en formato JSON.
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf8');
        } catch (error) {
            console.error('Error al guardar carritos:', error);
        }
    }

    async createCart() {
        // Creo un nuevo carrito y lo agrega a la lista de carritos.
        const newCart = {
            id: this.nextId++,
            products: [],
        };
        this.carts.push(newCart);
        await this.saveCarts(); // Guardo los cambios en el archivo.
        return newCart; // Devuelvo el nuevo carrito.
    }

    async getCartById(id) {
        // Obtengo un carrito por su ID.
        const cart = this.carts.find(c => c.id === id);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        return cart;
    }

    async addProductToCart(cartId, productId, quantity) {
        // Añado un producto a un carrito.
        const cart = await this.getCartById(cartId);
        const existingProduct = cart.products.find(p => p.product === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        await this.saveCarts(); // Guardo los cambios en el archivo.
    }
}

// Creo una instancia de CartManager con el archivo 'carrito.json'.
const cartManager = new CartManager('carrito.json');
cartManager.loadCarts(); // Cargo los carritos desde el archivo.

export default cartManager;