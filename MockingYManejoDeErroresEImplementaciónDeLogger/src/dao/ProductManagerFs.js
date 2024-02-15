import { getNewId, getJSONFromFile, saveJSONToFile } from '../helpers/utils.js';

// Defino la clase ProductManagerFs para gestionar productos en el sistema de archivos.
export class ProductManagerFs {
    constructor(path) {
        this.path = path; // Ruta del archivo de productos.
    }

    // Método para añadir un nuevo producto al sistema de archivos.
    async addProduct({ title, description, code, price, status, stock, category, thumbnails }) {
        // Verifico que todos los datos necesarios estén presentes.
        if (!(title && description && price && thumbnails && code && stock)) {
            throw new Error(`Some data is missing, please check your input`);
        }
        try {
            // Obtengo la lista de productos desde el archivo.
            const products = await getJSONFromFile(this.path);
            // Verifico si ya existe un producto con el mismo código.
            let findedCode = products.find((product) => product.code === code);
            if (!findedCode) {
                // Si no se encuentra un producto con el mismo código, creo un nuevo producto.
                let newProduct = {
                    id: getNewId(),
                    title,
                    description,
                    code,
                    price,
                    status,
                    stock,
                    category,
                    thumbnails
                };
                // Agrego el nuevo producto a la lista y guardo la lista actualizada en el archivo.
                products.push(newProduct);
                await saveJSONToFile(this.path, products);
                return newProduct;
            } else {
                // Si ya existe un producto con el mismo código, devuelvo un mensaje de error.
                let error = `The code '${findedCode.code}' already exists`;
                return error;
            }
        } catch (error) {
            // Si ocurre un error, lanzo una excepción con un mensaje descriptivo.
            throw new Error(`Something is wrong ${error.message}`);
        }
    }

    // Método para obtener todos los productos del sistema de archivos.
    async getProducts() {
        return getJSONFromFile(this.path);
    }

    // Método para obtener un producto por su ID del sistema de archivos.
    async getProductById(id) {
        // Obtengo la lista de productos desde el archivo.
        const products = await getJSONFromFile(this.path);
        // Busco el producto con el ID proporcionado.
        const findedProduct = products.find((product) => product.id === id);
        // Si se encuentra el producto, lo devuelvo; de lo contrario, devuelvo un mensaje de error.
        return findedProduct ? findedProduct : `Product with id ${id} doesn't exists`;
    }

    // Método para actualizar un producto existente en el sistema de archivos.
    async updateProduct({ id, title, description, code, price, status, stock, category, thumbnails }) {
        // Verifico que se proporcione un ID.
        if (!id) {
            throw new Error(`You must provide an ID`);
        }
        // Obtengo la lista de productos desde el archivo.
        const products = await getJSONFromFile(this.path);
        // Verifico si ya existe otro producto con el mismo código (excepto el producto que se está actualizando).
        let findedCode = products.find((product) => product.code === code && product.id !== id);
        if (findedCode) {
            throw new Error(`Provided code ${findedCode.code} already exists, can't update`);
        }
        // Obtengo el producto que se va a actualizar.
        let product = await this.getProductById(id);
        if (typeof product !== "string") {
            // Si el producto existe, actualizo sus atributos según los valores proporcionados.
            product.title = title || product.title;
            product.description = description || product.description;
            product.price = price || product.price;
            product.code = code || product.code;
            product.status = status !== undefined ? status : product.status;
            product.stock = stock || product.stock;
            product.category = category || product.category;
            product.thumbnails = thumbnails || product.thumbnails;
            // Actualizo la lista de productos con el producto actualizado.
            const data = await getJSONFromFile(this.path);
            const productIndex = data.findIndex((product) => product.id === id);
            data[productIndex] = product;
            await saveJSONToFile(this.path, data);
        } else {
            console.log("no entra");
        }
    }

    // Método para eliminar un producto del sistema de archivos por su ID.
    async deleteProduct(id) {
        // Verifico que se proporcione un ID.
        if (!id) {
            throw new Error(`You must provide an ID`);
        }
        // Obtengo el producto que se va a eliminar.
        let product = await this.getProductById(id);
        if (typeof product !== "string") {
            // Si el producto existe, lo elimino de la lista de productos y guardo la lista actualizada en el archivo.
            let products = await getJSONFromFile(this.path);
            products = products.filter((pro) => pro.id !== id);
            saveJSONToFile(this.path, products);
            console.log(`Product with id ${id} was deleted`);
            return products;
        } else {
            // Si el producto no existe, imprimo un mensaje de error.
            console.log(`Product with id ${id} doesn't exists`);
        }
    }
}
