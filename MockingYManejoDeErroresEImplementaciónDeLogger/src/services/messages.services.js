// Importar la clase MessageDao desde el archivo message.dao.js
import MessageDao from "../dao/message.dao.js";

// Definir la clase MessagesService
export default class MessagesService {
    // Método estático para encontrar todos los mensajes, con la opción de aplicar un filtro
    static findAll(filter = {}) {
        // Llamar al método get del MessageDao para encontrar todos los mensajes
        return MessageDao.get(filter);
    }

    // Método estático asincrónico para crear un nuevo mensaje
    static async create(payload) {
        // Crear un nuevo mensaje utilizando el método create del MessageDao
        const message = await MessageDao.create(payload);
        // Retornar el mensaje creado
        return message;
    }
}
