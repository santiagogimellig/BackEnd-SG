import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Define el esquema para los productos
const productSchema = new mongoose.Schema({
    // Título del producto
    title: { type: String, required: true },
    // Descripción del producto
    description: { type: String, required: true },
    // Código único del producto
    code: { type: String, required: true, unique: true },
    // Precio del producto
    price: { type: Number, required: true },
    // Estado del producto (activo o inactivo)
    status: { type: Boolean, default: true },
    // Stock disponible del producto
    stock: { type: Number, required: true },
    // Categoría del producto
    category: { type: String, required: true },
    // Lista de imágenes (thumbnails) del producto
    thumbnails: { type: [String], default: [] }
}, { timestamps: true }); // Se incluye el timestamp para registrar la fecha y hora de creación y actualización del producto

// Agrega el plugin mongoosePaginate al esquema para permitir la paginación de los resultados de las consultas
productSchema.plugin(mongoosePaginate);

// Exporta el modelo Product basado en el esquema productSchema
export default mongoose.model('Product', productSchema);
