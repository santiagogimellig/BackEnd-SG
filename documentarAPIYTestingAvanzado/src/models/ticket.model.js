import mongoose from "mongoose"; // Importa el módulo mongoose para trabajar con MongoDB

// Define el esquema para los tickets de compra
const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true }, // Código único del ticket
    purchase_datetime: { type: Date }, // Fecha y hora de la compra
    amount: { type: Number }, // Monto total de la compra
    purchaser: { type: String } // Comprador del ticket
}, { timestamps: true }); // Agrega marcas de tiempo al documento

// Exporta el modelo 'Ticket' basado en el esquema definido
export default mongoose.model('Ticket', ticketSchema);
