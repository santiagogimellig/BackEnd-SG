import fs from "fs"; // Importo el módulo 'fs' para interactuar con el sistema de archivos
import { v4 as uuidv4 } from 'uuid'; // Importo la función 'v4' de 'uuid' para generar identificadores únicos
import { fileURLToPath } from 'url'; // Importo la función 'fileURLToPath' de 'url' para obtener la ruta de un archivo URL
import { dirname } from 'path'; // Importo la función 'dirname' de 'path' para obtener el directorio de un archivo
import path from 'path'; // Importo el módulo 'path' para trabajar con rutas de archivos
import multer from "multer"; // Importo el módulo 'multer' para manejar la carga de archivos
import bcrypt from 'bcrypt'; // Importo el módulo 'bcrypt' para el cifrado y verificación de contraseñas
import jwt from 'jsonwebtoken'; // Importo el módulo 'jsonwebtoken' para la generación y verificación de tokens JWT
import passport from "passport"; // Importo el módulo 'passport' para la autenticación de usuarios
import UsersService from "../services/users.services.js"; // Importo el servicio de usuarios para la gestión de usuarios
import config from "../config.js"; // Importo la configuración de la aplicación

// Obtengo el nombre y el directorio del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Defino la ruta del directorio de utilidades como 'utilsDir', que es una subcarpeta dentro del directorio principal
const srcDir = dirname(__dirname);
const utilsDir = path.join(srcDir, 'utils');

// Exporto las variables '__filename', '__dirname' y 'utilsDir' para su uso en otros módulos
export { __filename, __dirname, utilsDir };

// Función para generar un nuevo identificador único utilizando 'uuidv4'
export const getNewId = () => uuidv4();

// Función para verificar si un archivo existe en la ruta proporcionada
const existFile = async (path) => {
    try {
        await fs.promises.access(path);
        return true; // Devuelve verdadero si el archivo existe
    } catch (error) {
        return false; // Devuelve falso si el archivo no existe o hay un error al acceder a él
    }
};

// Función para leer datos de un archivo JSON
export const getJSONFromFile = async (path) => {
    if (!(await existFile(path))) {
        return []; // Si el archivo no existe, devuelve un arreglo vacío
    }
    let content;
    try {
        content = await fs.promises.readFile(path, "utf-8"); // Lee el contenido del archivo
    } catch (error) {
        throw new Error(`El archivo ${path} no pudo ser leído.`); // Captura errores de lectura del archivo
    }
    try {
        return JSON.parse(content); // Convierte el contenido del archivo a un objeto JSON
    } catch (error) {
        throw new Error(`El archivo ${path} no tiene un formato JSON válido.`); // Captura errores de formato JSON inválido
    }
};

// Función para guardar datos en un archivo JSON
export const saveJSONToFile = async (path, data) => {
    const content = JSON.stringify(data, null, "\t"); // Convierte los datos a formato JSON
    try {
        await fs.promises.writeFile(path, content, "utf-8"); // Escribe los datos en el archivo
    } catch (error) {
        throw new Error(`El archivo ${path} no pudo ser escrito.`); // Captura errores de escritura del archivo
    }
};

// Clase para definir excepciones personalizadas
export class Exception extends Error {
    constructor(message, status) {
        super(message);
        this.statusCode = status;
    }
};

// Función para crear un hash de una contraseña utilizando 'bcrypt'
export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10)); // Genera un hash de la contraseña
}

// Función para verificar si una contraseña es válida
export const isValidPassword = (plainPasswordFromLogin, user) => {
    return bcrypt.compareSync(plainPasswordFromLogin, user.password); // Compara la contraseña ingresada con la almacenada
}

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
    destination: './public/productImages', // Directorio de destino para guardar las imágenes de los productos
    filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`; // Nombre de archivo único basado en la marca de tiempo y el nombre original
        cb(null, filename.replace(/\\/g, "/")); // Llama al callback con el nombre de archivo modificado
    }
});

// Middleware de multer para la gestión de archivos cargados
export const uploader = multer({ storage })

// Clave secreta para la generación de tokens JWT
const JWT_SECRET = config.jwtSecret;

// Función para generar un token JWT
export const tokenGenerator = (user, typeOfToken) => {
    const { _id, first_name, last_name, email } = user; // Extrae datos del usuario para el token
    const payload = {
        id: _id,
        first_name,
        last_name,
        email,
        login: (typeOfToken === 'login') ? true : false, // Indica si el token es para inicio de sesión
        recovery: (typeOfToken === 'recovery') ? true : false // Indica si el token es para recuperación de contraseña
    }
    let token;
    if (typeOfToken === 'login') {
        token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10m' }); // Genera un token para inicio de sesión con 10 minutos de validez
    }
    else if (typeOfToken === 'recovery') {
        token = jwt.sign(payload, JWT_SECRET, { expiresIn: '60m' }); // Genera un token para recuperación de contraseña con 60 minutos de validez
    } else {
        token = jwt.sign(payload, JWT_SECRET, { expiresIn: '60m' }); // Genera un token con 60 minutos de validez
    }
    return token; // Devuelve el token generado
}

// Función para verificar la validez de un token JWT
export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (error, payload) => {
            if (error) {
                return reject(error); // Rechaza la promesa si el token no es válido
            }
            resolve(payload); // Resuelve la promesa con el payload del token
        })
    })
}

// Middleware para autenticación JWT
export const jwtAuth = (req, res, next) => {
    const { authorization: token } = req.headers; // Obtiene el token de autorización del encabezado de la solicitud
    if (!token) {
        return res.status(401).json({ message: 'unauthorized' }); // Si no se proporciona un token, devuelve un error de autorización
    }
    jwt.verify(token, JWT_SECRET, async (error, payload) => {
        if (error) {
            return res.status(403).json({ message: 'no authorized' }); // Si el token no es válido, devuelve un error de autorización
        }
        req.user = await UsersService.findById(payload.id); // Almacena la información del usuario en la solicitud
        next(); // Llama al siguiente middleware
    })
}

// Middleware de autenticación para Passport
export const authMiddleware = (strategy) => (req, res, next) => {
    passport.authenticate(strategy, function (error, user, info) {
        if (error) {
            return next(error); // Si hay un error, pasa el error al siguiente middleware
        }
        if (!user) {
            return res.status(401).json({ message: info.message ? info.message : info.toString() }); // Si no se encuentra un usuario válido, devuelve un error de autorización
        }
        req.user = user; // Almacena la información del usuario en la solicitud
        next(); // Llama al siguiente middleware
    })(req, res, next)
}

// Middleware de autorización basado en roles
export const authorizationMiddleware = (roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' }); // Si no hay usuario en la solicitud, devuelve un error de autorización
    }
    const { rol: userRole } = req.user; // Obtiene el rol del usuario desde la solicitud
    if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden' }); // Si el rol del usuario no está autorizado, devuelve un error de autorización
    }
    next(); // Llama al siguiente middleware
}