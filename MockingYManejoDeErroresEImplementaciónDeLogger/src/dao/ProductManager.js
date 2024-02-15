// Importo el modelo de producto y la clase Exception desde sus respectivos archivos.
import ProductModel from '../models/product.model.js';
import { Exception } from '../helpers/utils.js';

// Defino la clase ProductManager.
export default class ProductManager {
    // Método para obtener productos paginados según los criterios y opciones proporcionados.
    static async get(criteria = {}, options = {}) {
        try {
            // Utilizo el método `paginate()` del modelo `ProductModel` para obtener productos paginados según los criterios y opciones especificados.
            const result = await ProductModel.paginate(criteria, options);
            return result;
        } catch (error) {
            // Si se produce un error, lanzo una nueva excepción con un mensaje descriptivo.
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    // Método para obtener un producto por su ID.
    static async getById(pid) {
        // Utilizo el método `findById()` del modelo `ProductModel` para buscar un producto por su ID.
        const product = await ProductModel.findById(pid);
        // Si no se encuentra el producto, lanzo una excepción con un mensaje específico.
        if (!product) {
            throw new Exception("No existe el producto", 404);
        }
        // Devuelvo el producto encontrado.
        return product;
    }

    // Método para crear un nuevo producto.
    static async create(data, files) {
        try {
            // Extraigo los datos necesarios del objeto `data`.
            const { title, description, code, price, stock, category } = data;
            // Creo un nuevo producto utilizando el método `create()` del modelo `ProductModel`, incluyendo los datos y las imágenes proporcionadas.
            const product = await ProductModel.create({
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails: files.map(file => file.filename) // Asigno los nombres de los archivos al campo "thumbnails".
            });
            // Registro un mensaje informativo de éxito.
            req.logger.info(`Producto creado exitosamente ${product}`);
            // Devuelvo el producto creado.
            return product;
        } catch (error) {
            // Si se produce un error, registro un mensaje de error y lanzo una excepción.
            console.log(`Error: ${error.message}`);
            throw new Exception(`Ha ocurrido un error en el servidor`, 500);
        }
    }

    // Método para actualizar un producto por su ID.
    static async updateById(pid, data) {
        console.log(`id ${pid} data ${data}`);
        // Busco el producto por su ID utilizando el método `findById()` del modelo `ProductModel`.
        const product = await ProductModel.findById(pid);
        // Si no se encuentra el producto, lanzo una excepción con un mensaje específico.
        if (!product) {
            throw new Exception('No existe el producto', 404);
        }
        // Defino los criterios de búsqueda y la operación de actualización.
        const criteria = { _id: pid };
        const operation = { $set: data };
        // Utilizo el método `updateOne()` del modelo `ProductModel` para actualizar el producto.
        await ProductModel.updateOne(criteria, operation);
        // Registro un mensaje informativo de éxito.
        req.logger.info('Producto actualizado correctamente');
    }

    // Método para eliminar un producto por su ID.
    static async deleteById(pid) {
        // Busco el producto por su ID utilizando el método `findById()` del modelo `ProductModel`.
        const product = await ProductModel.findById(pid);
        // Si no se encuentra el producto, lanzo una excepción con un mensaje específico.
        if (!product) {
            throw new Exception('No existe el producto', 404);
        }
        // Defino los criterios de búsqueda.
        const criteria = { _id: pid };
        // Utilizo el método `deleteOne()` del modelo `ProductModel` para eliminar el producto.
        await ProductModel.deleteOne(criteria);
        // Registro un mensaje informativo de éxito.
        req.logger.info('Producto eliminado correctamente');
    }
}