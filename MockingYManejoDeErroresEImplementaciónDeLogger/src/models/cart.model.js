import mongoose from 'mongoose';

// Esquema para los productos en el carrito
const productSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
});

// Esquema para el carrito
const cartSchema = new mongoose.Schema({
    // Lista de productos en el carrito
    products: { type: [productSchema], default: [] }
}, { timestamps: true });

// Pre middleware para poblar los productos antes de la consulta
cartSchema.pre('find', function () {
    this.populate('products.productId');
}).pre('findOne', function () {
    this.populate('products.productId');
});

// Exporta el modelo Cart basado en el esquema cartSchema
export default mongoose.model('Cart', cartSchema);
