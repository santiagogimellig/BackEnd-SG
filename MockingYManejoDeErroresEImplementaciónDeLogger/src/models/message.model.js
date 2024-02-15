import mongoose from 'mongoose';

// Definición del esquema para los mensajes
const messageSchema = new mongoose.Schema({
    // Nombre de usuario que envió el mensaje
    username: { type: String, required: true },
    // Contenido del mensaje
    message: { type: String, required: true },
}, { timestamps: true }); // Se incluye el timestamp para registrar la fecha y hora de creación del mensaje

// Exporta el modelo Message basado en el esquema messageSchema
export default mongoose.model('Message', messageSchema);
