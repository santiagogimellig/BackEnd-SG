import mongoose from 'mongoose'; // Importa el módulo mongoose para trabajar con MongoDB

// Define el esquema para los mensajes
const messageSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Nombre de usuario que envía el mensaje
    message: { type: String, required: true }, // Contenido del mensaje
}, { timestamps: true }); // Agrega marcas de tiempo al documento

// Exporta el modelo 'Message' basado en el esquema definido
export default mongoose.model('Message', messageSchema);