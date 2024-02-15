import mongoose from "mongoose";

// Define el esquema para los tickets de compra
const ticketSchema = new mongoose.Schema({
    // Código único del ticket
    code: { type: String, unique: true },
    // Fecha y hora de compra del ticket
    purchase_datetime: { type: Date },
    // Monto total de la compra
    amount: { type: Number },
    // Nombre del comprador
    purchaser: { type: String }
}, { timestamps: true }); // Se incluye el timestamp para registrar la fecha y hora de creación y actualización del ticket

// Exporta el modelo Ticket basado en el esquema ticketSchema
export default mongoose.model('Ticket', ticketSchema);
