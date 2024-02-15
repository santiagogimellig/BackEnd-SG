// Importo el modelo de mensaje desde su archivo correspondiente.
import MessageModel from '../models/message.model.js';
// Importo la clase de excepción desde el archivo de utilidades.
import { Exception } from '../helpers/utils.js';

// Defino la clase MessageManager.
export default class MessageManager {
    // Método para obtener mensajes de la base de datos.
    static async get(query = {}) {
        // Defino los criterios de búsqueda, en este caso, se buscan todos los mensajes.
        const criteria = {};
        // Utilizo el método `find()` del modelo `MessageModel` para buscar mensajes en la base de datos y devolverlos.
        return await MessageModel.find(criteria);
    }

    // Método para crear un nuevo mensaje en la base de datos.
    static async create(data) {
        console.log("data", data); // Imprimo los datos recibidos para crear el mensaje en la consola.
        try {
            // Utilizo el método `create()` del modelo `MessageModel` para crear un nuevo mensaje en la base de datos con los datos proporcionados.
            const message = await MessageModel.create(data);
            console.log(`Mensaje creado exitosamente`); // Muestro un mensaje en la consola indicando que el mensaje se ha creado con éxito.
            // Devuelvo el mensaje creado.
            return message;
        } catch (error) {
            console.log(`Error: ${error.message}`); // Muestro un mensaje de error en la consola si ocurre algún problema durante la creación del mensaje.
            // Lanzo una excepción con un mensaje genérico en caso de error, con código de estado 500 (Error del servidor).
            throw new Exception(`Ha ocurrido un error en el servidor`, 500);
        }
    }
}
