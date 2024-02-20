import { ProductDao } from "../dao/factory.js"; // Importar el DAO de productos desde un módulo factory

// Definir la clase ProductsService para manejar las operaciones relacionadas con los productos
export default class ProductsService {
    // Método estático para encontrar todos los productos según un filtro opcional y opciones adicionales
    static findAll(filter = {}, options) {
        return ProductDao.get(filter, options); // Llamar al método get del DAO de productos y devolver el resultado
    }

    // Método estático asincrónico para crear un nuevo producto
    static async create(payload) {
        console.log('creando producto'); // Imprimir un mensaje de registro
        const product = await ProductDao.create(payload); // Llamar al método create del DAO de productos para crear un nuevo producto
        console.log(`Producto creado correctamente (${product._id})`); // Imprimir un mensaje de registro con el ID del producto creado
        return product; // Devolver el producto creado
    }

    // Método estático para encontrar un producto por su ID
    static findById(pid) {
        return ProductDao.getById(pid); // Llamar al método getById del DAO de productos para encontrar un producto por su ID y devolver el resultado
    }

    // Método estático para actualizar un producto por su ID
    static updateById(pid, payload) {
        return ProductDao.updateById(pid, payload); // Llamar al método updateById del DAO de productos para actualizar un producto por su ID y devolver el resultado
    }

    // Método estático para eliminar un producto por su ID
    static deleteById(pid) {
        return ProductDao.deleteById(pid); // Llamar al método deleteById del DAO de productos para eliminar un producto por su ID y devolver el resultado
    }
}