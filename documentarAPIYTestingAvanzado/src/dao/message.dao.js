// Importo el modelo de mensaje desde el archivo message.model.js
import MessageModel from "../models/message.model.js";

// Exporto la clase MessageDao
export default class MessageDao {
    // Método para obtener mensajes que coincidan con un criterio de búsqueda (o todos si no se especifica ninguno)
    static get(query = {}) {
        // Defino un criterio de búsqueda vacío por defecto
        const criteria = {};
        // Utilizo el modelo de mensaje para encontrar los mensajes que coincidan con el criterio
        return MessageModel.find(criteria);
    }

    // Método para crear un nuevo mensaje
    static async create(data) {
        console.log("data", data); // Imprimo los datos del mensaje recibidos
        // Creo un nuevo mensaje utilizando el modelo de mensaje y los datos recibidos
        const message = await MessageModel.create(data);
        console.log(`Mensaje creado exitosamente`); // Registro un mensaje de éxito en la consola
        return message; // Devuelvo el mensaje creado
    }
}