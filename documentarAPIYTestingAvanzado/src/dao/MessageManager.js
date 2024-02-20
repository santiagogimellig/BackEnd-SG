// Importo el modelo de mensaje desde el archivo message.model.js
import MessageModel from '../models/message.model.js';
// Importo la clase Exception desde el archivo utils.js
import { Exception } from '../helpers/utils.js';

// Exporto la clase MessageManager
export default class MessageManager {
    // Método para obtener mensajes que coincidan con un criterio de búsqueda (o todos si no se especifica ninguno)
    static async get(query = {}) {
        // Defino un criterio de búsqueda vacío por defecto
        const criteria = {};
        // Utilizo el modelo de mensaje para encontrar los mensajes que coincidan con el criterio
        return await MessageModel.find(criteria);
    }

    // Método para crear un nuevo mensaje
    static async create(data) {
        console.log("data", data); // Imprimo los datos del mensaje recibidos
        try {
            // Intento crear un nuevo mensaje utilizando el modelo de mensaje y los datos recibidos
            const message = await MessageModel.create(data);
            console.log(`Mensaje creado exitosamente`); // Registro un mensaje de éxito en la consola
            return message; // Devuelvo el mensaje creado
        } catch (error) {
            console.log(`Error: ${error.message}`); // Registro el error en la consola
            // Lanzo una excepción con un mensaje genérico en caso de error en el servidor
            throw new Exception(`Ha ocurrido un error en el servidor`, 500);
        }
    }
}