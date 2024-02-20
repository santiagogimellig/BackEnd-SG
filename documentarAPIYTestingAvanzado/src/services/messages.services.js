import MessageDao from "../dao/message.dao.js"; // Importa el DAO de mensajes para interactuar con la base de datos

// Define la clase MessagesService para manejar las operaciones relacionadas con los mensajes
export default class MessagesService {
    // Método estático para encontrar todos los mensajes según un filtro opcional
    static findAll(filter = {}) {
        return MessageDao.get(filter); // Llama al método get del DAO de mensajes y devuelve el resultado
    }

    // Método estático asincrónico para crear un nuevo mensaje
    static async create(payload) {
        const message = await MessageDao.create(payload); // Llama al método create del DAO de mensajes para crear un nuevo mensaje
        return message; // Devuelve el mensaje creado
    }
}