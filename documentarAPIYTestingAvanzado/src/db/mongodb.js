// Importo las dependencias necesarias
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import config from '../config.js';

// Extraigo las URLs de la base de datos y el entorno desde el archivo de configuración
const URL_DB = config.db.mongodbURL;
const URL_DB_TEST = config.db.mongodbURL_TEST;
const ENVIRONMENT = config.ENV;

// Función asincrónica para inicializar la conexión con la base de datos
export const initDb = async () => {
    try {
        // Selecciono la base de datos según el entorno configurado
        switch (ENVIRONMENT) {
            case 'test':
                await mongoose.connect(URL_DB_TEST); // Conexión a la base de datos de prueba
                console.log('Test Database connected'); // Mensaje de éxito
                break;
            case 'dev':
                await mongoose.connect(URL_DB); // Conexión a la base de datos de desarrollo
                console.log('Dev Database connected'); // Mensaje de éxito
                break;
            case 'prod':
                await mongoose.connect(URL_DB); // Conexión a la base de datos de producción
                console.log('Production Database connected'); // Mensaje de éxito
                break;
            default:
                console.log('Wrong environment'); // Mensaje de error si el entorno no está configurado correctamente
                break;
        }
    } catch (error) {
        // Manejo de errores en caso de que falle la conexión
        console.log('An error occurred while trying to connect to the DB', error.message);
    }
}
