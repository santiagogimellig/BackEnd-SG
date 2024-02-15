// Importar la clase ProductDao desde el archivo factory.js
import { ProductDao } from "../dao/factory.js";

// Definir la clase ProductsService
export default class ProductsService {
    // Método estático para encontrar todos los productos, con la opción de aplicar un filtro y opciones adicionales
    static findAll(filter = {}, options) {
        // Llamar al método get del ProductDao para encontrar todos los productos
        return ProductDao.get(filter, options);
    }

    // Método estático asincrónico para crear un nuevo producto
    static async create(payload) {
        // Imprimir un mensaje de creación del producto en la consola
        console.log('Creando producto');
        // Crear un nuevo producto utilizando el método create del ProductDao
        const product = await ProductDao.create(payload);
        // Imprimir un mensaje de éxito con el ID del producto creado en la consola
        console.log(`Producto creado correctamente (${product._id})`);
        // Retornar el producto creado
        return product;
    }

    // Método estático para encontrar un producto por su ID
    static findById(pid) {
        // Llamar al método getById del ProductDao para encontrar un producto por su ID
        return ProductDao.getById(pid);
    }

    // Método estático para actualizar un producto por su ID
    static updateById(pid, payload) {
        // Llamar al método updateById del ProductDao para actualizar un producto por su ID
        return ProductDao.updateById(pid, payload);
    }

    // Método estático para eliminar un producto por su ID
    static deleteById(pid) {
        // Llamar al método deleteById del ProductDao para eliminar un producto por su ID
        return ProductDao.deleteById(pid);
    }
}
