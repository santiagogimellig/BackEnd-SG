import mongoose from 'mongoose'; // Importa el módulo mongoose para trabajar con MongoDB
import mongoosePaginate from 'mongoose-paginate-v2'; // Importa el plugin mongoose-paginate-v2 para la paginación de resultados

// Define el esquema para los productos
const productSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Título del producto
    description: { type: String, required: true }, // Descripción del producto
    code: { type: String, required: true, unique: true }, // Código único del producto
    price: { type: Number, required: true }, // Precio del producto
    status: { type: Boolean, default: true }, // Estado del producto (activo o inactivo)
    stock: { type: Number, required: true }, // Stock disponible del producto
    category: { type: String, required: true }, // Categoría del producto
    thumbnails: { type: [String], default: [] }, // Lista de imágenes en miniatura del producto
    owner: { // Propietario del producto (referencia al modelo User)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true }); // Agrega marcas de tiempo al documento

productSchema.plugin(mongoosePaginate); // Aplica el plugin de paginación al esquema de productos

// Exporta el modelo 'Product' basado en el esquema definido
export default mongoose.model('Product', productSchema);