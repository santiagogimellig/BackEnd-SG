// Importo la biblioteca 'dotenv' para cargar las variables de entorno desde un archivo .env
import dotenv from "dotenv";

// Cargo las variables de entorno desde el archivo .env
dotenv.config();

// Obtengo valores específicos de las variables de entorno para configurar mi sistema
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const CORREO_ADMIN = process.env.CORREO_ADMIN;
const PASSWORD_ADMIN = process.env.PASSWORD_ADMIN;
const SECRET = process.env.SECRET;
const PERSISTENCE = process.env.PERSISTENCE;

// Exporto un objeto que contiene la configuración de mi sistema
export const config = {
    server: {
        // Configuro el servidor, incluido el puerto y la persistencia
        port: PORT,
        persistence: PERSISTENCE
    },
    mongo: {
        // Configuro MongoDB, incluida la URL de conexión
        url: MONGO_URL
    },
    auth: {
        // Configuro la autenticación, incluyendo la cuenta de correo y la contraseña del administrador
        account: CORREO_ADMIN,
        pass: PASSWORD_ADMIN
    },
    session: {
        // Configuro la sesión, incluyendo el secreto
        secret: SECRET
    },
    gmail: {
        // Configuro Gmail, incluyendo la cuenta y contraseña del administrador
        adminAccount: process.env.ADMIN_EMAIL,
        adminPass: process.env.ADMIN_PASS
    },
    business: {
        // Configuro aspectos relacionados con el negocio, incluyendo el nombre del comercio electrónico
        ecommerceName: process.env.ECOMMERCE_NAME
    }
};