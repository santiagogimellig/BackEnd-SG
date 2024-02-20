// Importa los módulos y middleware necesarios
import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import passport from 'passport';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser'
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from './config.js';
import errorHandler from './middlewares/ErrorHandler.js';
import { init as initPassportConfig } from './config/passport.config.js';
import { addLogger } from './config/logger.js';
import indexRouter from './routers/api/index.router.js';
import indexJwtRouter from './routers/api/index.jwt.router.js';
import productsApiRouter from './routers/api/products.router.js'
import cartsApiRouter from './routers/api/carts.router.js'
import products from './routers/views/products.router.js';
import chatViewRouter from './routers/views/chat.router.js';
import cartViewRouter from './routers/views/carts.router.js';
import sessionsRouter from './routers/api/sessions.router.js';
import jwtRouter from './routers/api/jwt.router.js'
import logger from './routers/api/logger.router.js'
import usersRouter from './routers/api/users.router.js'

// Obtiene la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define rutas importantes
const srcDir = dirname(__dirname);
const utilsDir = path.join(srcDir, 'utils');

// Crea la aplicación Express
const app = express();

// Agrega middleware para registrar las solicitudes entrantes
app.use(addLogger);

// Configura el manejo de solicitudes JSON y URL codificadas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura el análisis de cookies
app.use(cookieParser());

// Configura el middleware de registro de solicitudes con Morgan en modo desarrollo
app.use(morgan('dev'));

// Configura la generación de la documentación Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Ecommerce CoderHouse',
            description: 'Esta es la documentación de la API del ecommerce de CoderHouse.',
        },
    },
    apis: [path.join(__dirname, '.', 'docs', '**', '*.yaml')],
};
const specs = swaggerJsDoc(swaggerOptions);

// Configura el directorio público para servir archivos estáticos
const publicDir = path.join(utilsDir, '../public');
app.use(express.static(publicDir));

// Configura el motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'handlebars');

// Inicializa la configuración de Passport para la autenticación
initPassportConfig();
app.use(passport.initialize());

// Configura las rutas para la documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Configura las rutas para la API de productos, carritos, registro de eventos y usuarios
app.use('/api/products', productsApiRouter);
app.use('/api/carts', cartsApiRouter);
app.use('/api/logger', logger);
app.use('/api/users', usersRouter);

// Configura las rutas para las vistas de productos, chat y carrito
app.use('/products', products);
app.use('/chat', chatViewRouter);
app.use('/cart', cartViewRouter);

// Configura las rutas para el punto de entrada principal de la API y las sesiones de autenticación
app.use('/', indexRouter);
app.use('/api', sessionsRouter);
app.use('/auth', jwtRouter);

// Configura el middleware para manejar errores
app.use(errorHandler);

// Exporta la aplicación Express configurada
export default app;