const fs = require('fs'); 

class ProductManager2 {
    constructor(filePath) {
        this.path = filePath; // Guardo la ruta del archivo en la propiedad path.
        this.products = this.loadProducts(); // Cargo los productos al inicializar la instancia.
        this.nextId = this.getNextId(); // Obtengo el siguiente ID disponible.
    }

    // Metodo para cargar los productos desde el archivo.
    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8'); // Leo el contenido del archivo.
            return JSON.parse(data); // Parseo el contenido como un objeto JS.
        } catch (error) {
            return []; // Si hay un error o el archivo no existe, devuelvo un array vacio.
        }
    }

    // Metodo para obtener el siguiente ID disponible.
    getNextId() {
        return this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
        // Si hay productos, obtengo el maximo ID y le sumo 1. Si no hay productos, el siguiente ID es 1.
    }

    // Metodo para guardar los productos en el archivo.
    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
    }

    // Metodo para agregar un producto.
    addProduct(product) {
        const { title, description, price, thumbnail, code, stock } = product;

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios"); // Mensaje de error si faltan campos.
            return;
        }

        if (this.products.some(p => p.code === code)) {
            console.error("Ya existe un producto con ese código"); // Mensaje de error si el codigo ya existe.
            return;
        }

        const newProduct = {
            id: this.nextId++, // Asigno un ID autoincrementable.
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(newProduct); // Agrego el nuevo producto al arreglo de productos.
        this.saveProducts(); // Guardo los productos en el archivo.
    }

    // Metodo para obtener todos los productos.
    getProducts() {
        return this.products; // Devuelvo el arreglo de productos.
    }

    // Metodo para obtener un producto por su ID.
    getProductById(id) {
        const product = this.products.find(p => p.id === id); // Busco el producto por ID.
        if (!product) {
            console.error("Producto no encontrado"); // Mensaje de error si el producto no se encuentra.
        }
        return product;
    }

    // Metodo para actualizar un producto por su ID.
    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(p => p.id === id); // Encuentro el indice del producto.
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct, id };
            // Actualizo el producto con el nuevo contenido.
            this.saveProducts(); // Guardo los productos en el archivo.
        } else {
            console.error("Producto no encontrado"); // Mensaje de error si el producto no se encuentra.
        }
    }

    // Metodo para eliminar un producto por su ID.
    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id); // Encuentro el indice del producto.
        if (index !== -1) {
            this.products.splice(index, 1); // Elimino el producto del arreglo.
            this.saveProducts(); // Guardo los productos en el archivo.
        } else {
            console.error("Producto no encontrado"); // Mensaje de error si el producto no se encuentra.
        }
    }
}