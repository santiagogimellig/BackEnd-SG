// Importo el módulo mongoose para interactuar con MongoDB
import mongoose from "mongoose";

// Defino el nombre de la colección en MongoDB
const chatCollection = "messages";

// Defino el esquema del modelo para la colección de mensajes
const chatSchema = new mongoose.Schema({
    // Propiedad 'user': Almacena el nombre de usuario asociado al mensaje
    user: {
        type: String,
        required: true  // El nombre de usuario es obligatorio
    },
    // Propiedad 'message': Almacena el contenido del mensaje
    message: {
        type: String,
        required: true  // El contenido del mensaje es obligatorio
    }
});

// Creo el modelo 'chatModel' utilizando el esquema definido
const chatModel = mongoose.model(chatCollection, chatSchema);

// Exporto el modelo para su uso en otras partes de la aplicación
export default chatModel;