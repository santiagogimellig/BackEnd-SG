// Importación de los módulos necesarios
import express from 'express'; // Importa el framework Express para construir aplicaciones web.
import handlebars from 'express-handlebars'; // Importa el motor de plantillas Handlebars para generar vistas dinámicas.
import path from 'path'; // Importa el módulo 'path' para manejar rutas de archivos y directorios.
import passport from 'passport'; // Importa Passport.js para autenticación de usuarios.
import morgan from 'morgan'; // Importa el módulo 'morgan' para el registro de solicitudes HTTP.
import { fileURLToPath } from 'url'; // Importa la función para convertir una URL en la ruta de un archivo.
import { dirname } from 'path'; // Importa la función para obtener el nombre del directorio de un archivo.
import MongoStore from 'connect-mongo'; // Importa MongoStore para almacenar sesiones en MongoDB.
import cookieParser from 'cookie-parser'; // Importa cookie-parser para analizar cookies en las solicitudes HTTP.
import config from './config.js'; // Importa la configuración de la aplicación.
import errorHandler from './middlewares/ErrorHandler.js'; // Importa el middleware para manejar errores.
import { init as initPassportConfig } from './config/passport.config.js'; // Importa la función de inicialización de Passport.js.
import { addLogger } from './config/logger.js'; // Importa la función para agregar un logger a la aplicación.
import indexRouter from './routers/api/index.router.js'; // Importa el enrutador principal de la API.
import indexJwtRouter from './routers/api/index.jwt.router.js'; // Importa el enrutador principal de la API con JWT.
import productsApiRouter from './routers/api/products.router.js'; // Importa el enrutador de la API para productos.
import cartsApiRouter from './routers/api/carts.router.js'; // Importa el enrutador de la API para carritos.
import products from './routers/views/products.router.js'; // Importa el enrutador de las vistas de productos.
import chatViewRouter from './routers/views/chat.router.js'; // Importa el enrutador de las vistas de chat.
import cartViewRouter from './routers/views/carts.router.js'; // Importa el enrutador de las vistas de carritos.
import sessionsRouter from './routers/api/sessions.router.js'; // Importa el enrutador de la API para sesiones.
import jwtRouter from './routers/api/jwt.router.js'; // Importa el enrutador de la API para JWT.
import logger from './routers/api/logger.router.js'; // Importa el enrutador de la API para el logger.

// Obtener el nombre del archivo y el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const srcDir = dirname(__dirname);

// Crear la aplicación Express
const app = express();

// Añadir el logger a la aplicación
app.use(addLogger);

// Configuración de los middleware
app.use(express.json()); // Middleware para analizar el cuerpo de las solicitudes con formato JSON.
app.use(express.urlencoded({ extended: true })); // Middleware para analizar el cuerpo de las solicitudes codificadas en URL.
app.use(cookieParser()); // Middleware para analizar cookies en las solicitudes HTTP.
app.use(morgan('dev')); // Middleware para registrar las solicitudes HTTP en la consola.

// Configuración del directorio de archivos estáticos
const publicDir = path.join(srcDir, 'public');
app.use(express.static(publicDir)); // Middleware para servir archivos estáticos desde el directorio 'public'.

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine()); // Configura el motor de plantillas Handlebars.
app.set('views', path.join(__dirname, './views')); // Establece el directorio de vistas.
app.set('view engine', 'handlebars'); // Establece el motor de plantillas para las vistas.

// Inicialización de Passport.js
initPassportConfig(); // Inicializa Passport.js con la configuración.

// Configuración de las rutas
app.use('/api/products', productsApiRouter); // Ruta para las operaciones relacionadas con productos en la API.
app.use('/api/carts', cartsApiRouter); // Ruta para las operaciones relacionadas con carritos en la API.
app.use('/api/logger', logger) // Ruta para las operaciones relacionadas con el logger en la API.
app.use('/products', products); // Ruta para las vistas relacionadas con productos.
app.use('/chat', chatViewRouter); // Ruta para las vistas relacionadas con el chat.
app.use('/cart', cartViewRouter); // Ruta para las vistas relacionadas con los carritos.
app.use('/', indexRouter); // Ruta principal de la API.
app.use('/api', sessionsRouter); // Ruta para las sesiones en la API.
app.use('/auth', jwtRouter); // Ruta para la autenticación JWT.

// Manejo de errores
app.use(errorHandler); // Middleware para manejar errores.

// Exportar la aplicación
export default app;
