class ProductManager {
    constructor() {
        this.products = [];
        this.nextId = 1;
    }
    
    //Metodo para agregar un producto al carrito
    addProduct(product) {
        const { title, description, price, thumbnail, code, stock } = product;
    
        //Verifico si algun campo requerido esta faltante
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }
    
        //Verifico si ya existe un producto con el mismo codigo
        if (this.products.some(p => p.code === code)) {
            console.error("Ya existe un producto con ese código");
            return;
        }
    
        //Creo un nuevo producto con un ID autoincrementable
        const newProduct = {
            id: this.nextId++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
    
        //Agrego el nuevo producto al arreglo de productos
        this.products.push(newProduct);
    }
    
    //Metodo para obtener todos los productos
    getProducts() {
        return this.products;
    }
    
    //Metodo para obtener un producto por su ID
    getProductById(id) {
        //Busco un producto en el arreglo que tenga el ID que paso por parametro
        const product = this.products.find(p => p.id === id);
        //Si no encuentro el producto, emito un mensaje de error
        if (!product) {
            console.error("Producto no encontrado");
        }
        return product;
    }
}