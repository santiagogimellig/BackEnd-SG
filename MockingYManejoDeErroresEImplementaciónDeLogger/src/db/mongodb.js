// Importa la clase Server desde el módulo 'socket.io' para trabajar con sockets
import { Server } from 'socket.io';
// Importa Mongoose para interactuar con la base de datos MongoDB
import mongoose from 'mongoose';
// Importa la configuración del archivo config.js
import config from '../config.js';

// Obtiene la URL de la base de datos MongoDB desde la configuración
const URL_DB = config.db.mongodbURL;

// Función async para inicializar la conexión a la base de datos
export const initDb = async () => {
    try {
        // Intenta conectar con la base de datos utilizando la URL proporcionada
        await mongoose.connect(URL_DB);
        // Si la conexión es exitosa, imprime un mensaje indicando que la base de datos está conectada
        console.log('Database conected 🚀');
    } catch (error) {
        // Si ocurre un error durante la conexión, imprime un mensaje de error con el mensaje de error específico
        console.log('Ah ocurrido un error al intentar conectarnos a la DB', error.message);
    }
}