// Importo el modelo de producto desde su archivo correspondiente.
import ProductModel from '../models/product.model.js';

// Defino la clase ProductDao.
export default class ProductDao {
    // Método para obtener productos paginados de la base de datos.
    static get(criteria = {}, options) {
        // Utilizo el método `paginate()` del modelo `ProductModel` para obtener productos paginados según los criterios de búsqueda y opciones proporcionados.
        return ProductModel.paginate(criteria, options);
    }

    // Método para crear un nuevo producto en la base de datos.
    static create(payload) {
        // Extraigo los datos necesarios del payload.
        const { title, description, code, price, stock, category } = payload.data;
        const { files } = payload;
        // Creo un nuevo producto utilizando el método `create()` del modelo `ProductModel`, incluyendo los datos y las imágenes proporcionadas.
        const product = ProductModel.create({
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: files?.map(file => file.filename) // Si hay imágenes proporcionadas, añado sus nombres al campo "thumbnails".
        });
        // Devuelvo el producto creado.
        return product;
    }

    // Método para obtener un producto por su ID desde la base de datos.
    static getById(pid) {
        // Utilizo el método `findById()` del modelo `ProductModel` para encontrar un producto por su ID y devolverlo.
        return ProductModel.findById(pid);
    }

    // Método para actualizar un producto por su ID en la base de datos.
    static updateById(pid, data) {
        // Utilizo el método `updateOne()` del modelo `ProductModel` para actualizar un producto por su ID con los datos proporcionados.
        return ProductModel.updateOne({ _id: pid }, { $set: data });
    }

    // Método para eliminar un producto por su ID de la base de datos.
    static deleteById(pid) {
        // Utilizo el método `deleteOne()` del modelo `ProductModel` para eliminar un producto por su ID.
        return ProductModel.deleteOne({ _id: pid });
    }
}