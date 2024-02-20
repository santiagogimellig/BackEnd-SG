// Importo el servicio necesario desde un archivo local
import MessagesService from "../services/messages.services.js";

// Defino y exporto la clase MessageController
export default class MessageController {
    // Método estático para obtener mensajes
    static async get(query = {}) {
        // Obtengo todos los mensajes utilizando el servicio de mensajes
        const messages = await MessagesService.findAll();
        return messages; // Devuelvo los mensajes obtenidos
    }

    // Método estático para crear un mensaje
    static async create(data) {
        // Creo un nuevo mensaje utilizando los datos proporcionados y el servicio de mensajes
        const message = await MessagesService.create(data)
        return message; // Devuelvo el mensaje creado
    }
}
