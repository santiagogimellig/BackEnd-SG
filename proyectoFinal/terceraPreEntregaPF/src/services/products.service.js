// Importo el DAO de productos en memoria
import productsDaoMemory from "../dao/products.dao.js";

// Clase que proporciona servicios relacionados con la gestión de productos
class ProductsService {
    // Obtiene una lista de productos según los parámetros proporcionados
    getProducts(params) {
        return productsDaoMemory.getProducts(params);
    }

    // Agrega un nuevo producto
    addProduct(product) {
        return productsDaoMemory.addProduct(product);
    }

    // Obtiene un producto por su ID
    getProductById(idProduct) {
        return productsDaoMemory.getProductById(idProduct);
    }

    // Actualiza la información de un producto existente
    updateProduct(idProduct, newProduct) {
        return productsDaoMemory.updateProduct(idProduct, newProduct);
    }

    // Elimina un producto por su ID
    deleteProduct(idProduct) {
        return productsDaoMemory.deleteProduct(idProduct);
    }
}

// Exporto una instancia de la clase como servicio de productos
export default new ProductsService();