// Importo el módulo mongoose para interactuar con MongoDB
import mongoose from "mongoose";

// Defino el nombre de la colección en MongoDB
const collection = 'Ticket';

// Defino el esquema del modelo para la colección de tickets
const schema = new mongoose.Schema({
    // Propiedad 'code': Almacena el código identificador único del ticket
    code: String,
    // Propiedad 'purchase_datetime': Almacena la fecha y hora de la compra (se establece por defecto como la fecha actual)
    purchase_datetime: {
        type: Date,
        default: Date.now()
    },
    // Propiedad 'amount': Almacena el monto total de la compra
    amount: Number,
    // Propiedad 'purchaser': Almacena el comprador asociado al ticket
    purchaser: String,
    // Propiedad 'products': Almacena un array de objetos con información sobre los productos asociados al ticket
    products: {
        type: [
            {
                // Cada elemento del array contiene un objeto con la referencia al modelo de productos y la cantidad comprada
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"  // Referencia al modelo de productos
                },
                quantity: Number  // Cantidad del producto comprada
            }
        ],
        default: []  // Valor predeterminado, un ticket comienza sin productos
    }
});

// Creo el modelo 'TicketModel' utilizando el esquema definido
const TicketModel = mongoose.model(collection, schema);

// Exporto el modelo para su uso en otras partes de la aplicación
export default TicketModel;