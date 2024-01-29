// Importo el modelo de la colección de productos desde el archivo correspondiente
import productModel from "./models/products.model.js";

// Clase ProductsDaoMemory que implementa operaciones CRUD para la colección de productos
class ProductsDaoMemory {
    // Método para verificar si un producto con el mismo código ya existe
    checkDuplicatedProduct = async (code) => {
        let result = await productModel.find({ code: code })
        if (result.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    // Método para obtener productos con paginación y filtros
    getProducts = async (params) => {
        const { limit, input_page, query, sort } = params;
        const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalDocs, page, totalPages } = await productModel.paginate(query, { limit: limit, page: input_page, sort: sort, lean: true });
        return { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalDocs, page, totalPages };
    }
    // Método para agregar un nuevo producto
    addProduct = async (product) => {
        let product_duplicated = await this.checkDuplicatedProduct(product.code);
        if (product_duplicated) {
            throw new Error("Product with duplicated code");
        } else {
            await productModel.create(product);
            return product;
        }
    }
    // Método para obtener un producto por su ID
    getProductById = async (idProduct) => {
        try {
            let product_found = await productModel.find({ _id: idProduct });
            if (product_found.length > 0) {
                return product_found[0];
            } else {
                throw new Error('Error in get operation. Product not found.');
            }
        } catch (error) {
            throw new Error('Error in get operation. Product not found.');
        }
    }
    // Método para actualizar un producto por su ID
    updateProduct = async (id_product, newProduct) => {
        let product_found = await productModel.find({ _id: id_product });
        if (product_found.length > 0) {
            let result = await productModel.updateOne({ _id: id_product }, { $set: newProduct });
            let products = await this.getProducts();
            return products;
        } else {
            throw new Error('Error in update operation. Product not found.');
        }
    }
    // Método para eliminar un producto por su ID
    deleteProduct = async (id_product) => {
        let products = await this.getProducts();
        let product_found = await productModel.find({ _id: id_product });
        if (product_found.length > 0) {
            const result = await productModel.deleteOne({ _id: id_product });
            products = await this.getProducts();
            return product_found;
        } else {
            throw new Error('Error in delete operation. Product not found.');
        }
    }
}

// Exporto una instancia única de la clase ProductsDaoMemory para su uso en otras partes de la aplicación
export default new ProductsDaoMemory();