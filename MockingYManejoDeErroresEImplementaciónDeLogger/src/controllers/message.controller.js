// Importo el servicio necesario desde su respectivo archivo.
import MessagesService from "../services/messages.services.js";

// Exporto la clase 'MessageController'.
export default class MessageController {
    // Método estático para obtener mensajes con un filtro opcional.
    static async get(query = {}) {
        // Obtengo todos los mensajes utilizando el servicio 'MessagesService'.
        const messages = await MessagesService.findAll();
        // Devuelvo los mensajes obtenidos.
        return messages
    }

    // Método estático para crear un nuevo mensaje.
    static async create(data) {
        // Creo un nuevo mensaje utilizando el servicio 'MessagesService'.
        const message = await MessagesService.create(data)
        // Devuelvo el mensaje creado.
        return message;
    }
}