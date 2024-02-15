// Importo el modelo de mensaje desde su archivo correspondiente.
import MessageModel from "../models/message.model.js";

// Defino la clase MessageDao.
export default class MessageDao {
    // Método para obtener mensajes de la base de datos.
    static get(query = {}) {
        // Defino los criterios de búsqueda, en este caso, se buscan todos los mensajes.
        const criteria = {};
        // Utilizo el método `find()` del modelo `MessageModel` para buscar mensajes en la base de datos y devolverlos.
        return MessageModel.find(criteria);
    }

    // Método para crear un nuevo mensaje en la base de datos.
    static async create(data) {
        console.log("data", data); // Imprimo los datos recibidos para crear el mensaje en la consola.
        // Utilizo el método `create()` del modelo `MessageModel` para crear un nuevo mensaje en la base de datos con los datos proporcionados.
        const message = await MessageModel.create(data);
        console.log(`Mensaje creado exitosamente`); // Muestro un mensaje en la consola indicando que el mensaje se ha creado con éxito.
        // Devuelvo el mensaje creado.
        return message;
    }
}