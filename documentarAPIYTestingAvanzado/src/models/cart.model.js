import mongoose from 'mongoose'; // Importa el módulo mongoose para trabajar con MongoDB

// Define el esquema para los productos en el carrito
const productSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // ID del producto relacionado
    quantity: { type: Number, required: true } // Cantidad del producto en el carrito
});

// Define el esquema para el carrito
const cartSchema = new mongoose.Schema({
    products: { type: [productSchema], default: [] } // Array de productos en el carrito
}, { timestamps: true }); // Agrega marcas de tiempo al documento

// Agrega un middleware para población antes de realizar una operación de búsqueda
cartSchema.pre('find', function () {
    this.populate('products.productId'); // Pobla los productos del carrito con sus detalles
}).pre('findOne', function () {
    this.populate('products.productId'); // Pobla los productos del carrito con sus detalles
});

// Exporta el modelo 'Cart' basado en el esquema definido
export default mongoose.model('Cart', cartSchema);