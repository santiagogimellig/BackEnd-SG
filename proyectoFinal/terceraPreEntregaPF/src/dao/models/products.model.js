// Importo los módulos mongoose y mongoose-paginate-v2 para interactuar con MongoDB y agregar paginación
import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

// Defino el nombre de la colección en MongoDB
const collection = 'products';

// Defino el esquema del modelo para la colección de productos
const schema = new mongoose.Schema({
    // Propiedad 'title': Almacena el título del producto
    title: {
        type: String,
        require: true  // El título del producto es obligatorio
    },
    // Propiedad 'description': Almacena la descripción del producto
    description: {
        type: String,
        require: true  // La descripción del producto es obligatoria
    },
    // Propiedad 'price': Almacena el precio del producto
    price: {
        type: Number,
        require: true  // El precio del producto es obligatorio
    },
    // Propiedad 'thumbnail': Almacena un array de URLs de imágenes del producto
    thumbnail: {
        type: Array,
        require: false  // No es obligatorio tener imágenes asociadas al producto
    },
    // Propiedad 'code': Almacena un código identificador único del producto
    code: {
        type: String,
        require: true  // El código del producto es obligatorio
    },
    // Propiedad 'stock': Almacena la cantidad disponible en stock del producto
    stock: {
        type: Number,
        require: true  // La cantidad en stock del producto es obligatoria
    },
    // Propiedad 'status': Almacena el estado del producto (puede ser opcional)
    status: {
        type: Boolean,
        require: false  // El estado del producto es opcional
    },
    // Propiedad 'category': Almacena la categoría a la que pertenece el producto
    category: {
        type: String,
        require: true  // La categoría del producto es obligatoria
    }
})

// Agrego la funcionalidad de paginación al esquema
schema.plugin(mongoosePaginate);

// Creo el modelo 'productModel' utilizando el esquema definido
const productModel = mongoose.model(collection, schema);

// Exporto el modelo para su uso en otras partes de la aplicación
export default productModel;