// Importo el modelo de la colección de mensajes desde el archivo correspondiente
import chatModel from "./models/chat.model.js";

// Clase ChatDaoMemory que implementa operaciones CRUD para la colección de mensajes
class ChatDaoMemory {
    
    // Método para añadir un nuevo mensaje a la colección
    async addMessage(object) {
        try {
            // Intento crear un nuevo mensaje en la base de datos
            const data = await chatModel.create(object);
            
            // Parseo la respuesta a formato JSON
            const response = JSON.parse(JSON.stringify(data));
            
            // Retorno la respuesta
            return response;
        } catch (error) {
            // Si hay un error al guardar, lanzo una excepción con un mensaje descriptivo
            throw new Error(`Error al guardar: ${error}`);
        }
    };

    // Método para obtener todos los mensajes de la colección
    async getMessages() {
        try {
            // Obtengo todos los mensajes de la base de datos
            const data = await chatModel.find();
            
            // Parseo la respuesta a formato JSON
            const response = JSON.parse(JSON.stringify(data));
            
            // Retorno la respuesta
            return response;
        } catch (error) {
            // Si hay un error al obtener los mensajes, lanzo una excepción con un mensaje descriptivo
            throw new Error(`Error al obtener todos ${error}`);
        }
    };
}

// Exporto una instancia única de la clase ChatDaoMemory para su uso en otras partes de la aplicación
export default new ChatDaoMemory();