// Importo las funciones de utilidad desde el archivo utils.js en la carpeta helpers
import { getNewId, getJSONFromFile, saveJSONToFile } from '../helpers/utils.js';

// Defino la clase ProductManagerFs
export class ProductManagerFs {
    // Constructor que recibe la ruta del archivo de productos
    constructor(path) {
        this.path = path; // Establezco la ruta del archivo
    }

    // Método para agregar un nuevo producto al archivo de productos
    async addProduct({ title, description, code, price, status, stock, category, thumbnails }) {
        // Verifico si los datos necesarios están presentes
        if (!(title && description && price && thumbnails && code && stock)) {
            throw new Error(`Some data is missing, please check your input`);
        }
        try {
            // Obtengo la lista de productos desde el archivo
            const products = await getJSONFromFile(this.path);
            // Busco si ya existe un producto con el mismo código
            let findedCode = products.find((product) => product.code === code);
            if (!findedCode) {
                // Si no se encuentra un producto con el mismo código, creo uno nuevo
                let newProduct = {
                    id: getNewId(), // Genero un nuevo ID para el producto
                    title,
                    description,
                    code,
                    price,
                    status,
                    stock,
                    category,
                    thumbnails
                };
                // Agrego el nuevo producto a la lista de productos
                products.push(newProduct);
                // Guardo la lista actualizada de productos en el archivo
                await saveJSONToFile(this.path, products);
                return newProduct; // Devuelvo el nuevo producto agregado
            } else {
                // Si ya existe un producto con el mismo código, retorno un mensaje de error
                let error = `The code '${findedCode.code}' already exists`;
                return error;
            }
        } catch (error) {
            // Capturo cualquier error y lanzo una nueva excepción con un mensaje personalizado
            throw new Error(`Something is wrong ${error.message}`);
        }
    }

    // Método para obtener todos los productos del archivo
    async getProducts() {
        return getJSONFromFile(this.path); // Devuelvo la lista de productos desde el archivo
    }

    // Método para obtener un producto por su ID
    async getProductById(id) {
        // Obtengo la lista de productos desde el archivo
        const products = await getJSONFromFile(this.path);
        // Busco el producto con el ID proporcionado
        const findedProduct = products.find((product) => product.id === id);
        return findedProduct ? findedProduct : `Product with id ${id} doesn't exists`; // Devuelvo el producto encontrado o un mensaje de error si no se encuentra
    }

    // Método para actualizar un producto existente
    async updateProduct({ id, title, description, code, price, status, stock, category, thumbnails }) {
        // Verifico si se proporcionó un ID
        if (!id) {
            throw new Error(`You must provide an ID`);
        }
        // Obtengo la lista de productos desde el archivo
        const products = await getJSONFromFile(this.path);
        // Busco si ya existe otro producto con el mismo código (excepto el producto actual)
        let findedCode = products.find((product) => product.code === code && product.id !== id);
        if (findedCode) {
            // Si se encuentra un producto con el mismo código, lanzo una excepción
            throw new Error(`Provided code ${findedCode.code} already exists, can't update`);
        }
        // Obtengo el producto actualizado por su ID
        let product = await this.getProductById(id);
        if (typeof product !== "string") {
            // Si el producto existe, actualizo sus datos con los nuevos valores proporcionados
            product.title = title || product.title;
            product.description = description || product.description;
            product.price = price || product.price;
            product.code = code || product.code;
            product.status = status !== undefined ? status : product.status;
            product.stock = stock || product.stock;
            product.category = category || product.category;
            product.thumbnails = thumbnails || product.thumbnails;
            // Obtengo la lista de productos y actualizo el producto modificado
            const data = await getJSONFromFile(this.path);
            const productIndex = data.findIndex((product) => product.id === id);
            data[productIndex] = product;
            await saveJSONToFile(this.path, data); // Guardo la lista actualizada de productos en el archivo
        } else {
            console.log("no entra"); // Si no se encuentra el producto, registro un mensaje en la consola
        }
    }

    // Método para eliminar un producto por su ID
    async deleteProduct(id) {
        // Verifico si se proporcionó un ID
        if (!id) {
            throw new Error(`You must provide an ID`);
        }
        // Obtengo el producto por su ID
        let product = await this.getProductById(id);
        if (typeof product !== "string") {
            // Si el producto existe, elimino el producto de la lista
            let products = await getJSONFromFile(this.path);
            products = products.filter((pro) => pro.id !== id);
            saveJSONToFile(this.path, products); // Guardo la lista actualizada de productos en el archivo
            console.log(`Product with id ${id} was deleted`); // Registro un mensaje de éxito en la consola
            return products;
        } else {
            console.log(`Product with id ${id} doesn't exists`); // Si no se encuentra el producto, registro un mensaje en la consola
        }
    }
}