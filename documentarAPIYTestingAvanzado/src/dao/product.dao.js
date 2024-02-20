// Importo el modelo de producto desde el archivo product.model.js
import ProductModel from '../models/product.model.js';

// Exporto la clase ProductDao
export default class ProductDao {
    // Método para obtener productos paginados que coincidan con un criterio de búsqueda (o todos si no se especifica ninguno)
    static get(criteria = {}, options) {
        // Utilizo el método paginate del modelo de producto para obtener productos paginados según el criterio y opciones proporcionadas
        return ProductModel.paginate(criteria, options);
    }

    // Método para crear un nuevo producto
    static create(payload) {
        // Extraigo los datos del payload
        const { title, description, code, price, stock, category, owner } = payload.data;
        const { files } = payload;
        // Creo un nuevo producto utilizando el modelo de producto y los datos proporcionados
        const product = ProductModel.create({
            title, description, code, price, stock, category, owner,
            // Si hay archivos en el payload, asigno los nombres de los archivos al campo de miniaturas del producto
            thumbnails: files?.map(file => file.filename)
        });
        return product; // Devuelvo el producto creado
    }

    // Método para obtener un producto por su ID
    static getById(pid) {
        // Utilizo el método findById del modelo de producto para encontrar un producto por su ID
        return ProductModel.findById(pid);
    }

    // Método para actualizar un producto por su ID
    static updateById(pid, data) {
        // Utilizo el método updateOne del modelo de producto para actualizar un producto por su ID con los datos proporcionados
        return ProductModel.updateOne({ _id: pid }, { $set: data });
    }

    // Método para eliminar un producto por su ID
    static deleteById(pid) {
        // Utilizo el método deleteOne del modelo de producto para eliminar un producto por su ID
        return ProductModel.deleteOne({ _id: pid });
    }
}