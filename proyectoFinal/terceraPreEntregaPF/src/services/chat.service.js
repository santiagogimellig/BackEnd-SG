// Importo el DAO de chat en memoria
import chatDaoMemory from "../dao/chat.dao.js";

// Clase que proporciona servicios relacionados con la gestión del chat
class ChatService {
    // Agrega un nuevo mensaje al chat
    addMessage(object) {
        return chatDaoMemory.addMessage(object);
    }
    // Obtiene todos los mensajes del chat
    getMessages() {
        return chatDaoMemory.getMessages();
    }
}

// Exporto una instancia de la clase como servicio de chat
export default new ChatService();