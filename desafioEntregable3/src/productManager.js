const fs = require('fs').promises; 

class productManager {
    constructor(filePath) { // Constructor que recibe la ruta del archivo products.json.
        this.path = filePath; // Guardo la ruta del archivo en la propiedad path.
        this.nextId = 1; // Inicializo el ID a 1 y el arreglo de productos vacio.
        this.products = [];
    }

    // Metodo asincronico para cargar los productos desde el archivo.
    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data); // Parseo el contenido como un objeto JS y lo asignamos a this.products.
            this.nextId = this.getNextId(); // Obtengo el siguiente ID disponible.
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }

    // Metodo para obtener el siguiente ID disponible.
    getNextId() {
        return this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    }

    // Metodo asincronico para guardar los productos en el archivo.
    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf8'); // Escribo el arreglo de productos en el archivo en formato JSON.
        } catch (error) {
            console.error('Error al guardar productos:', error);
        }
    }

    // Metodo para agregar un producto.
    async addProduct(product) {
        try {
            const { title, description, price, thumbnail, code, stock } = product; // Extraigo los atributos del producto.
            // Verifico si algun campo esta vacio y mostramos un mensaje de error si es el caso.
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                throw new Error("Todos los campos son obligatorios");
            }
            // Verifico si ya existe un producto con el mismo codigo y mostramos un mensaje de error si es el caso.
            if (this.products.some(p => p.code === code)) {
                throw new Error("Ya existe un producto con ese código");
            }
            const newProduct = { // Creo un nuevo producto con un ID autoincrementable.
                id: this.nextId++,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };
            this.products.push(newProduct); // Agrego el nuevo producto al arreglo de productos.
            await this.saveProducts(); // Guardo los productos en el archivo.
        } catch (error) {
            console.error(error.message);
        }
    }

    // Metodo para obtener todos los productos.
    getProducts() {
        return this.products;
    }

    // Metodo para obtener un producto por su ID.
    getProductById(id) {
        const product = this.products.find(p => p.id === id); // Busco el producto por ID.
        if (!product) {
            throw new Error("Producto no encontrado");
        }
        return product;
    }

    // Metodo para actualizar un producto por su ID.
    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(p => p.id === id); // Encuentro el indice del producto en el arreglo.
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct, id }; // Actualizo el producto con el nuevo contenido.
            this.saveProducts(); // Guardo los productos en el archivo.
        } else {
            throw new Error("Producto no encontrado");
        }
    }

    // Metodo para eliminar un producto por su ID.
    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id); // Encuentro el indice del producto en el arreglo.
        if (index !== -1) {
            this.products.splice(index, 1); // Elimino el producto del arreglo.
            this.saveProducts(); // Guardo los productos en el archivo.
        } else {
            throw new Error("Producto no encontrado");
        }
    }

    // Metodo para obtener un numero limitado de productos.
    getLimitedProducts(limit) {
        return this.products.slice(0, limit);
    }
}

// Funcion asincrónica para realizar las pruebas.
async function runTests() {
    const manager = new productManager('products.json'); // Creo una instancia de ProductManager.

    try {
        const productsBeforeAdd = await manager.getProducts(); // Obtengo los productos antes de agregar uno.
        console.log('Productos antes de agregar:', productsBeforeAdd);

        // Agrego un producto.
        await manager.addProduct({
            title: "producto prueba",
            description: "Este es un producto prueba",
            price: 250,
            thumbnail: "Sin imagen",
            code: "a12",
            stock: 20
        });
        console.log('Producto agregado satisfactoriamente.');
        const productsAfterAdd = await manager.getProducts(); // Obtengo los productos despues de agregar uno.
        console.log('Productos después de agregar:', productsAfterAdd);
        const foundProduct = await manager.getProductById(1); // Busco un producto por su ID.
        console.log('Producto encontrado por ID:', foundProduct);
        // Actualizo un producto.
        await manager.updateProduct(1, {
            title: "Producto Actualizado",
            description: "Este producto ha sido actualizado",
            price: 300,
        });
        console.log('Producto actualizado.');
        await manager.deleteProduct(1); // Elimino un producto.
        console.log('Producto eliminado.');
        const productsAfterDelete = await manager.getProducts(); // Obtengo los productos despues de eliminar uno.
        console.log('Productos después de eliminar:', productsAfterDelete);
    } catch (error) {
        console.error('Error en las pruebas:', error);
    }
}

module.exports = { productManager, runTests }; // Exporto productManager y runTests para su uso en otros archivos.
