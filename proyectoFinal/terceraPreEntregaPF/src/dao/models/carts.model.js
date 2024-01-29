// Importo el módulo mongoose para interactuar con MongoDB
import mongoose from 'mongoose';

// Defino el nombre de la colección en MongoDB
const collection = 'carts';

// Defino el esquema del modelo para la colección de carritos
const schema = new mongoose.Schema({
    // Defino la propiedad 'products' que almacena un array de objetos con información sobre los productos en el carrito
    products: {
        type: [
            {
                // Cada elemento del array contiene un objeto con la referencia al producto y su cantidad en el carrito
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"  // Referencia al modelo de productos
                },
                quantity: Number  // Cantidad del producto en el carrito
            }
        ],
        default: []  // Valor predeterminado, un carrito comienza vacío
    }
});

// Antes de realizar una operación de búsqueda, configuro la población de la referencia al modelo de productos
schema.pre('find', function () {
    this.populate("products.product");
});

// Creo el modelo 'cartModel' utilizando el esquema definido
const cartModel = mongoose.model(collection, schema);

// Exporto el modelo para su uso en otras partes de la aplicación
export default cartModel;