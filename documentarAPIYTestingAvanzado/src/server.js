// Importación de módulos y configuraciones necesarias
import http from 'http'; // Módulo HTTP de Node.js
import config from './config.js'; // Archivo de configuración
import app from './app.js'; // Instancia de la aplicación Express
import { init } from './socket.js'; // Función de inicialización del servidor de socket
import 'dotenv/config'; // Carga las variables de entorno desde el archivo .env

// Obtiene el puerto del archivo de configuración o utiliza el puerto 8080 por defecto
const SERVER_PORT = config.port || 8080;

// Crea un servidor HTTP utilizando la aplicación Express y lo pone a escuchar en el puerto especificado
const httpServer = app.listen(SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${SERVER_PORT} `);
});

// Inicia el servidor de socket pasando el servidor HTTP creado anteriormente
await init(httpServer);