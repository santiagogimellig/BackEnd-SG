import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    default: []
});

cartSchema.pre('find', function () {
    this.populate('products.product');
});

cartSchema.pre('findOne', function () {
    this.populate('products.product');
});

export default mongoose.model('carts', cartSchema);