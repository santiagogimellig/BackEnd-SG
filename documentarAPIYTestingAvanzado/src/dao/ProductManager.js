// Importo el modelo de producto desde el archivo product.model.js
import ProductModel from '../models/product.model.js';
// Importo la clase Exception desde el archivo utils.js en la carpeta helpers
import { Exception } from '../helpers/utils.js';

// Exporto la clase ProductManager
export default class ProductManager {
    // Método para obtener productos según un criterio de búsqueda y opciones de paginación (opcional)
    static async get(criteria = {}, options = {}) {
        try {
            // Utilizo el método paginate del modelo de producto para obtener productos paginados según el criterio y opciones proporcionadas
            const result = await ProductModel.paginate(criteria, options);
            return result; // Devuelvo el resultado
        } catch (error) {
            // Capturo cualquier error y lanzo una nueva excepción con un mensaje personalizado
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    // Método para obtener un producto por su ID
    static async getById(pid) {
        // Utilizo el método findById del modelo de producto para encontrar un producto por su ID
        const product = await ProductModel.findById(pid);
        if (!product) {
            // Si no se encuentra el producto, lanzo una excepción con un mensaje personalizado y el código de estado 404
            throw new Exception("No existe el producto", 404);
        }
        return product; // Devuelvo el producto encontrado
    }

    // Método para crear un nuevo producto
    static async create(data, files) {
        try {
            // Extraigo los datos del objeto data
            const { title, description, code, price, stock, category } = data;
            // Creo un nuevo producto utilizando el modelo de producto y los datos proporcionados, incluyendo los nombres de archivo de las miniaturas
            const product = await ProductModel.create({
                title, description, code, price, stock, category,
                thumbnails: files.map(file => file.filename)
            });
            // Registro un mensaje informativo en el registro de eventos indicando que el producto se creó exitosamente
            req.logger.info(`Producto creado exitosamente ${product}`);
            return product; // Devuelvo el producto creado
        } catch (error) {
            // Capturo cualquier error y lanzo una nueva excepción con un mensaje personalizado y el código de estado 500
            console.log(`Error: ${error.message}`);
            throw new Exception(`Ha ocurrido un error en el servidor`, 500);
        }
    }

    // Método para actualizar un producto por su ID
    static async updateById(pid, data) {
        // Utilizo el método findById del modelo de producto para encontrar un producto por su ID
        const product = await ProductModel.findById(pid);
        if (!product) {
            // Si no se encuentra el producto, lanzo una excepción con un mensaje personalizado y el código de estado 404
            throw new Exception('No existe el producto', 404);
        }
        const criteria = { _id: pid };
        const operation = { $set: data };
        // Utilizo el método updateOne del modelo de producto para actualizar el producto con los nuevos datos
        await ProductModel.updateOne(criteria, operation);
        console.log('Producto actualizado correctamente'); // Registro un mensaje de éxito en la consola
    }

    // Método para eliminar un producto por su ID
    static async deleteById(pid) {
        // Utilizo el método findById del modelo de producto para encontrar un producto por su ID
        const product = await ProductModel.findById(pid);
        if (!product) {
            // Si no se encuentra el producto, lanzo una excepción con un mensaje personalizado y el código de estado 404
            throw new Exception('No existe el producto', 404);
        }
        const criteria = { _id: pid };
        // Utilizo el método deleteOne del modelo de producto para eliminar el producto por su ID
        await ProductModel.deleteOne(criteria);
        console.log('Producto eliminado correctamente'); // Registro un mensaje de éxito en la consola
    }
}